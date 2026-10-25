import * as migration_20261024_154809_initial from './20261024_154809_initial';
import * as migration_20261024_180000_blob_object_key from './20261024_180000_blob_object_key';
import * as migration_20261025_155014_image_text_and_product_sections from './20261025_155014_image_text_and_product_sections';
import * as migration_20261025_210432_hero_image_area from './20261025_210432_hero_image_area';
import * as migration_20261025_211545_image_fit from './20261025_211545_image_fit';
import * as migration_20261025_215711_cards_columns_images from './20261025_215711_cards_columns_images';

export const migrations = [
  {
    up: migration_20261024_154809_initial.up,
    down: migration_20261024_154809_initial.down,
    name: '20261024_154809_initial',
  },
  {
    up: migration_20261024_180000_blob_object_key.up,
    down: migration_20261024_180000_blob_object_key.down,
    name: '20261024_180000_blob_object_key',
  },
  {
    up: migration_20261025_155014_image_text_and_product_sections.up,
    down: migration_20261025_155014_image_text_and_product_sections.down,
    name: '20261025_155014_image_text_and_product_sections',
  },
  {
    up: migration_20261025_210432_hero_image_area.up,
    down: migration_20261025_210432_hero_image_area.down,
    name: '20261025_210432_hero_image_area',
  },
  {
    up: migration_20261025_211545_image_fit.up,
    down: migration_20261025_211545_image_fit.down,
    name: '20261025_211545_image_fit',
  },
  {
    up: migration_20261025_215711_cards_columns_images.up,
    down: migration_20261025_215711_cards_columns_images.down,
    name: '20261025_215711_cards_columns_images'
  },
];
