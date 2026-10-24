-- =====================================================================
-- Prairie Clean Enterprises — PostgreSQL schema (PostgreSQL 16+, Neon)
-- Content model + typed form submissions. Run inside one transaction.
-- =====================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------
-- Shared: enums, updated_at trigger
-- ---------------------------------------------------------------------
CREATE TYPE publish_status   AS ENUM ('draft', 'published', 'archived');
CREATE TYPE product_line     AS ENUM ('flax_fibre', 'fuel_pellets', 'cat_litter', 'animal_bedding');
CREATE TYPE product_market   AS ENUM ('b2b', 'b2c', 'both');
CREATE TYPE product_attr_kind AS ENUM ('spec', 'feature', 'application');
CREATE TYPE news_kind        AS ENUM ('article', 'video', 'pdf', 'press_release');
CREATE TYPE employment_type  AS ENUM ('full_time', 'part_time', 'contract', 'seasonal');
CREATE TYPE submission_status AS ENUM ('new', 'in_review', 'responded', 'closed', 'spam');
CREATE TYPE straw_interest   AS ENUM ('sell_this_year', 'rofr', 'information');
CREATE TYPE bale_type        AS ENUM ('round', 'large_square');
CREATE TYPE province_code    AS ENUM ('AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT','US');
CREATE TYPE admin_role       AS ENUM ('owner', 'editor', 'reviewer');

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- ---------------------------------------------------------------------
-- Admin users (staff who edit content and work the submission inboxes)
-- Authentication itself lives in the auth provider; this table maps
-- the provider's subject id to a role.
-- ---------------------------------------------------------------------
CREATE TABLE admin_users (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  auth_subject  text        NOT NULL UNIQUE,
  email         citext      NOT NULL UNIQUE,
  full_name     text        NOT NULL,
  role          admin_role  NOT NULL DEFAULT 'editor',
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Media library. Alt text is mandatory unless the image is marked
-- decorative, which closes the current site's 16-of-48 missing-alt gap
-- at the data layer.
-- ---------------------------------------------------------------------
CREATE TABLE media_assets (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  blob_url       text        NOT NULL UNIQUE,
  mime_type      text        NOT NULL,
  width          integer     CHECK (width  > 0),
  height         integer     CHECK (height > 0),
  alt_text       text,
  is_decorative  boolean     NOT NULL DEFAULT false,
  caption        text,
  credit         text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT media_alt_required
    CHECK (is_decorative OR (alt_text IS NOT NULL AND length(btrim(alt_text)) > 0)),
  CONSTRAINT media_image_dimensions
    CHECK (mime_type NOT LIKE 'image/%' OR (width IS NOT NULL AND height IS NOT NULL))
);

-- ---------------------------------------------------------------------
-- Pages + ordered content blocks (CMS)
-- ---------------------------------------------------------------------
CREATE TABLE pages (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug             text           NOT NULL UNIQUE
                   CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*(/[a-z0-9]+(-[a-z0-9]+)*)*$'),
  title            text           NOT NULL,
  seo_title        text           CHECK (length(seo_title) <= 60),
  seo_description  text           CHECK (length(seo_description) <= 160),
  og_image_id      bigint         REFERENCES media_assets(id) ON DELETE SET NULL,
  status           publish_status NOT NULL DEFAULT 'draft',
  published_at     timestamptz,
  created_at       timestamptz    NOT NULL DEFAULT now(),
  updated_at       timestamptz    NOT NULL DEFAULT now(),
  CONSTRAINT pages_published_has_date
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE content_blocks (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page_id     bigint  NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  position    integer NOT NULL CHECK (position >= 0),
  block_type  text    NOT NULL CHECK (block_type IN (
                'hero', 'rich_text', 'stat_grid', 'feature_grid', 'process_steps',
                'media_text', 'product_cards', 'partner_logos', 'team_grid',
                'faq', 'cta_band', 'news_list', 'job_list', 'form')),
  data        jsonb   NOT NULL DEFAULT '{}'::jsonb
              CHECK (jsonb_typeof(data) = 'object'),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_blocks_unique_position UNIQUE (page_id, position) DEFERRABLE INITIALLY DEFERRED
);

-- ---------------------------------------------------------------------
-- Products: flax fibre, fuel pellets, cat litter, animal bedding
-- ---------------------------------------------------------------------
CREATE TABLE products (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug               text           NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  line               product_line   NOT NULL UNIQUE,
  market             product_market NOT NULL,
  name               text           NOT NULL,
  tagline            text,
  summary            text           NOT NULL,
  body               jsonb          NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(body) = 'array'),
  hero_image_id      bigint         REFERENCES media_assets(id) ON DELETE SET NULL,
  brochure_asset_id  bigint         REFERENCES media_assets(id) ON DELETE SET NULL,
  consumer_site_url  text           CHECK (consumer_site_url ~ '^https://'),
  retail_order_code  text,
  sort_order         smallint       NOT NULL DEFAULT 0,
  status             publish_status NOT NULL DEFAULT 'draft',
  seo_title          text           CHECK (length(seo_title) <= 60),
  seo_description    text           CHECK (length(seo_description) <= 160),
  published_at       timestamptz,
  created_at         timestamptz    NOT NULL DEFAULT now(),
  updated_at         timestamptz    NOT NULL DEFAULT now(),
  CONSTRAINT products_published_has_date
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE product_attributes (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint            NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  kind        product_attr_kind NOT NULL,
  label       text              NOT NULL,
  value       text,
  unit        text,
  position    smallint          NOT NULL DEFAULT 0,
  CONSTRAINT product_attributes_spec_has_value
    CHECK (kind <> 'spec' OR value IS NOT NULL),
  CONSTRAINT product_attributes_unique_label UNIQUE (product_id, kind, label)
);

CREATE TABLE retailers (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  url         text CHECK (url ~ '^https://'),
  logo_id     bigint REFERENCES media_assets(id) ON DELETE SET NULL,
  regions     text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE product_retailers (
  product_id   bigint NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
  retailer_id  bigint NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  product_url  text   CHECK (product_url ~ '^https://'),
  PRIMARY KEY (product_id, retailer_id)
);

-- ---------------------------------------------------------------------
-- Company: team and partners
-- ---------------------------------------------------------------------
CREATE TABLE team_members (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text     NOT NULL,
  title       text     NOT NULL,
  bio         text,
  photo_id    bigint   REFERENCES media_assets(id) ON DELETE SET NULL,
  linkedin    text     CHECK (linkedin ~ '^https://([a-z]+\.)?linkedin\.com/'),
  position    smallint NOT NULL DEFAULT 0,
  is_visible  boolean  NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partners (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text     NOT NULL UNIQUE,
  url         text     CHECK (url ~ '^https://'),
  logo_id     bigint   NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
  category    text     NOT NULL CHECK (category IN ('academic', 'government', 'industry', 'retail', 'finance')),
  position    smallint NOT NULL DEFAULT 0,
  is_visible  boolean  NOT NULL DEFAULT true
);

-- ---------------------------------------------------------------------
-- News: mostly outbound media coverage, plus first-party releases
-- ---------------------------------------------------------------------
CREATE TABLE news_items (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug           text           NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind           news_kind      NOT NULL DEFAULT 'article',
  title          text           NOT NULL,
  source_name    text,
  external_url   text           CHECK (external_url ~ '^https://'),
  excerpt        text           NOT NULL CHECK (length(excerpt) <= 400),
  body           jsonb          CHECK (body IS NULL OR jsonb_typeof(body) = 'array'),
  image_id       bigint         REFERENCES media_assets(id) ON DELETE SET NULL,
  attachment_id  bigint         REFERENCES media_assets(id) ON DELETE SET NULL,
  published_on   date           NOT NULL,
  status         publish_status NOT NULL DEFAULT 'draft',
  is_featured    boolean        NOT NULL DEFAULT false,
  created_at     timestamptz    NOT NULL DEFAULT now(),
  updated_at     timestamptz    NOT NULL DEFAULT now(),
  -- Coverage links out; a press release carries its own body.
  CONSTRAINT news_has_destination
    CHECK (external_url IS NOT NULL OR body IS NOT NULL OR attachment_id IS NOT NULL),
  CONSTRAINT news_external_has_source
    CHECK (external_url IS NULL OR source_name IS NOT NULL)
);

CREATE TABLE news_item_products (
  news_item_id  bigint NOT NULL REFERENCES news_items(id) ON DELETE CASCADE,
  product_id    bigint NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  PRIMARY KEY (news_item_id, product_id)
);

-- ---------------------------------------------------------------------
-- Careers
-- ---------------------------------------------------------------------
CREATE TABLE job_postings (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug             text            NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text            NOT NULL,
  location         text            NOT NULL DEFAULT 'Weyburn, SK',
  employment_type  employment_type NOT NULL,
  shift            text,
  summary          text            NOT NULL,
  body             jsonb           NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(body) = 'array'),
  salary_min       numeric(10,2)   CHECK (salary_min >= 0),
  salary_max       numeric(10,2),
  salary_period    text            CHECK (salary_period IN ('hour', 'year')),
  status           publish_status  NOT NULL DEFAULT 'draft',
  posted_at        timestamptz,
  closes_at        timestamptz,
  created_at       timestamptz     NOT NULL DEFAULT now(),
  updated_at       timestamptz     NOT NULL DEFAULT now(),
  CONSTRAINT job_salary_range CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min),
  CONSTRAINT job_salary_period CHECK ((salary_min IS NULL AND salary_max IS NULL) OR salary_period IS NOT NULL),
  CONSTRAINT job_close_after_post CHECK (closes_at IS NULL OR posted_at IS NULL OR closes_at > posted_at),
  CONSTRAINT job_published_has_date CHECK (status <> 'published' OR posted_at IS NOT NULL)
);

-- ---------------------------------------------------------------------
-- Submissions. One table per form so each has real, typed columns.
-- Every row records consent and a salted IP hash (never the raw IP).
-- ---------------------------------------------------------------------
CREATE TABLE contact_submissions (
  id            uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    text              NOT NULL CHECK (length(btrim(first_name)) BETWEEN 1 AND 100),
  last_name     text              CHECK (length(last_name) <= 100),
  email         citext            NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text              CHECK (phone ~ '^[0-9+()\-. ]{7,20}$'),
  topic         text              NOT NULL DEFAULT 'general'
                CHECK (topic IN ('general', 'flax_fibre', 'fuel_pellets', 'cat_litter', 'animal_bedding', 'media')),
  message       text              NOT NULL CHECK (length(btrim(message)) BETWEEN 1 AND 5000),
  consent_at    timestamptz       NOT NULL,
  ip_hash       text,
  user_agent    text,
  status        submission_status NOT NULL DEFAULT 'new',
  assigned_to   bigint            REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at    timestamptz       NOT NULL DEFAULT now(),
  updated_at    timestamptz       NOT NULL DEFAULT now()
);

-- Replaces the third-party JotForm on /straw-buy-form. Captures the
-- page's own purchase criteria (bale weight, moisture, type) as data.
CREATE TABLE straw_offers (
  id                     uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  interest               straw_interest    NOT NULL,
  full_name              text              NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 150),
  farm_name              text,
  email                  citext            NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                  text              NOT NULL CHECK (phone ~ '^[0-9+()\-. ]{7,20}$'),
  province               province_code     NOT NULL,
  rural_municipality     text,
  nearest_town           text              NOT NULL,
  legal_land_location    text,
  crop_year              smallint          CHECK (crop_year BETWEEN 2020 AND 2100),
  flax_acres             integer           CHECK (flax_acres > 0),
  estimated_bales        integer           CHECK (estimated_bales > 0),
  bale_type              bale_type,
  avg_bale_weight_lb     integer           CHECK (avg_bale_weight_lb > 0),
  moisture_pct           numeric(4,1)      CHECK (moisture_pct BETWEEN 0 AND 100),
  rock_free              boolean,
  can_transport          boolean,
  message                text              CHECK (length(message) <= 5000),
  consent_at             timestamptz       NOT NULL,
  ip_hash                text,
  status                 submission_status NOT NULL DEFAULT 'new',
  assigned_to            bigint            REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at             timestamptz       NOT NULL DEFAULT now(),
  updated_at             timestamptz       NOT NULL DEFAULT now(),
  -- Selling this year needs the quantities to evaluate the offer.
  CONSTRAINT straw_sell_requires_details CHECK (
    interest <> 'sell_this_year'
    OR (crop_year IS NOT NULL AND estimated_bales IS NOT NULL AND bale_type IS NOT NULL)
  ),
  -- Generated flag mirrors the published purchase criteria
  -- (900 lb+, 15% moisture or less, rock free).
  meets_criteria         boolean GENERATED ALWAYS AS (
    avg_bale_weight_lb >= 900 AND moisture_pct <= 15 AND rock_free IS TRUE
  ) STORED
);

CREATE TABLE investor_inquiries (
  id               uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        text              NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 150),
  email            citext            NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone            text              CHECK (phone ~ '^[0-9+()\-. ]{7,20}$'),
  province         province_code     NOT NULL,
  is_accredited    boolean           NOT NULL,
  message          text              CHECK (length(message) <= 5000),
  consent_at       timestamptz       NOT NULL,
  package_sent_at  timestamptz,
  ip_hash          text,
  status           submission_status NOT NULL DEFAULT 'new',
  assigned_to      bigint            REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at       timestamptz       NOT NULL DEFAULT now(),
  updated_at       timestamptz       NOT NULL DEFAULT now(),
  -- Investor packages go to accredited investors only.
  CONSTRAINT investor_package_accredited_only
    CHECK (package_sent_at IS NULL OR is_accredited)
);

CREATE TABLE job_applications (
  id               uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id   bigint            NOT NULL REFERENCES job_postings(id) ON DELETE RESTRICT,
  full_name        text              NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 150),
  email            citext            NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone            text              NOT NULL CHECK (phone ~ '^[0-9+()\-. ]{7,20}$'),
  resume_blob_url  text              CHECK (resume_blob_url ~ '^https://'),
  cover_note       text              CHECK (length(cover_note) <= 5000),
  consent_at       timestamptz       NOT NULL,
  ip_hash          text,
  status           submission_status NOT NULL DEFAULT 'new',
  assigned_to      bigint            REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at       timestamptz       NOT NULL DEFAULT now(),
  updated_at       timestamptz       NOT NULL DEFAULT now(),
  CONSTRAINT job_application_once UNIQUE (job_posting_id, email)
);

-- ---------------------------------------------------------------------
-- Indexes: match the real read paths, keep writes cheap.
-- ---------------------------------------------------------------------
-- Public reads only ever touch published rows: partial indexes.
CREATE INDEX pages_published_idx        ON pages (slug)                         WHERE status = 'published';
CREATE INDEX products_published_idx     ON products (sort_order, id)            WHERE status = 'published';
CREATE INDEX news_published_idx         ON news_items (published_on DESC, id DESC) WHERE status = 'published';
CREATE INDEX news_featured_idx          ON news_items (published_on DESC)        WHERE status = 'published' AND is_featured;
CREATE INDEX jobs_open_idx              ON job_postings (posted_at DESC)         WHERE status = 'published';
CREATE INDEX team_visible_idx           ON team_members (position)               WHERE is_visible;
CREATE INDEX partners_visible_idx       ON partners (position)                   WHERE is_visible;

-- Child-row lookups (Postgres does not index foreign keys automatically).
CREATE INDEX content_blocks_page_idx    ON content_blocks (page_id, position);
CREATE INDEX product_attributes_idx     ON product_attributes (product_id, kind, position);
CREATE INDEX product_retailers_ret_idx  ON product_retailers (retailer_id);
CREATE INDEX news_item_products_prod_idx ON news_item_products (product_id);
CREATE INDEX job_applications_job_idx   ON job_applications (job_posting_id, created_at DESC);
CREATE INDEX pages_og_image_idx         ON pages (og_image_id);
CREATE INDEX products_hero_idx          ON products (hero_image_id);
CREATE INDEX products_brochure_idx      ON products (brochure_asset_id);
CREATE INDEX news_image_idx             ON news_items (image_id);
CREATE INDEX news_attachment_idx        ON news_items (attachment_id);
CREATE INDEX team_photo_idx             ON team_members (photo_id);
CREATE INDEX partners_logo_idx          ON partners (logo_id);
CREATE INDEX retailers_logo_idx         ON retailers (logo_id);

-- Staff inboxes: open items, newest first.
CREATE INDEX contact_inbox_idx   ON contact_submissions (created_at DESC) WHERE status IN ('new', 'in_review');
CREATE INDEX straw_inbox_idx     ON straw_offers        (created_at DESC) WHERE status IN ('new', 'in_review');
CREATE INDEX investor_inbox_idx  ON investor_inquiries  (created_at DESC) WHERE status IN ('new', 'in_review');
CREATE INDEX job_app_inbox_idx   ON job_applications    (created_at DESC) WHERE status IN ('new', 'in_review');
CREATE INDEX straw_region_idx    ON straw_offers (province, crop_year);
CREATE INDEX contact_assignee_idx  ON contact_submissions (assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX straw_assignee_idx    ON straw_offers        (assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX investor_assignee_idx ON investor_inquiries  (assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX job_app_assignee_idx  ON job_applications    (assigned_to) WHERE assigned_to IS NOT NULL;

-- Rate limiting: recent submissions from one hashed IP.
CREATE INDEX contact_ip_recent_idx  ON contact_submissions (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;
CREATE INDEX straw_ip_recent_idx    ON straw_offers        (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;
CREATE INDEX investor_ip_recent_idx ON investor_inquiries  (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;
CREATE INDEX job_app_ip_recent_idx  ON job_applications    (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'admin_users', 'pages', 'content_blocks', 'products', 'team_members',
    'news_items', 'job_postings', 'contact_submissions', 'straw_offers',
    'investor_inquiries', 'job_applications'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t || '_set_updated_at', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------
-- Rate-limit helper. The public role cannot read submissions, so it gets
-- a count (never rows) through this SECURITY DEFINER function.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION recent_submission_count(p_ip_hash text, p_window interval DEFAULT '1 hour')
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT (
      (SELECT count(*) FROM contact_submissions WHERE ip_hash = p_ip_hash AND created_at > now() - p_window)
    + (SELECT count(*) FROM straw_offers        WHERE ip_hash = p_ip_hash AND created_at > now() - p_window)
    + (SELECT count(*) FROM investor_inquiries  WHERE ip_hash = p_ip_hash AND created_at > now() - p_window)
    + (SELECT count(*) FROM job_applications    WHERE ip_hash = p_ip_hash AND created_at > now() - p_window)
  )::integer
$$;
REVOKE ALL ON FUNCTION recent_submission_count(text, interval) FROM PUBLIC;

-- ---------------------------------------------------------------------
-- Least-privilege role for the public site. The site reads content and
-- inserts submissions; it cannot read submissions back.
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pce_web') THEN
    CREATE ROLE pce_web NOLOGIN;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO pce_web;
GRANT SELECT ON media_assets, pages, content_blocks, products, product_attributes,
                retailers, product_retailers, team_members, partners,
                news_items, news_item_products, job_postings TO pce_web;
GRANT INSERT ON contact_submissions, straw_offers, investor_inquiries, job_applications TO pce_web;
GRANT EXECUTE ON FUNCTION recent_submission_count(text, interval) TO pce_web;

COMMIT;
