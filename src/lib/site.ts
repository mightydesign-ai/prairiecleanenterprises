export const site = {
  name: "Prairie Clean Enterprises",
  shortName: "PCE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://prairiecleanenterprises.com",
  description:
    "Prairie Clean Enterprises buys flax straw from prairie farmers and turns it into flax fibre, fuel pellets, cat litter and animal bedding at the world's first flax straw multi-processing facility in Weyburn, Saskatchewan.",
} as const;

export type NavLink = { label: string; href: string; description?: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const isGroup = (item: NavItem): item is { label: string; children: NavLink[] } =>
  "children" in item;

// Organized by audience: buyers, farmers, the public, investors, job seekers.
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    children: [
      { label: "Flax Fibre", href: "/products/flax-fibre", description: "Pulp, specialty paper and biomaterials" },
      { label: "Fuel Pellets", href: "/products/fuel-pellets", description: "Low-carbon heat and power" },
      { label: "Cat Litter", href: "/products/cat-litter", description: "Clay-free, low dust, in Co-op stores" },
      { label: "Animal Bedding", href: "/products/animal-bedding", description: "Horses, cattle, poultry, small animals" },
    ],
  },
  { label: "Sell Your Straw", href: "/sell-your-straw" },
  { label: "Sustainability", href: "/sustainability" },
  {
    label: "Company",
    children: [
      { label: "About PCE", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Careers", href: "/careers" },
    ],
  },
  { label: "Investors", href: "/investors" },
];

export const contactCta: NavLink = { label: "Contact us", href: "/contact" };

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Products",
    links: [
      { label: "Flax Fibre", href: "/products/flax-fibre" },
      { label: "Fuel Pellets", href: "/products/fuel-pellets" },
      { label: "Cat Litter", href: "/products/cat-litter" },
      { label: "Animal Bedding", href: "/products/animal-bedding" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "News", href: "/news" },
      { label: "Careers", href: "/careers" },
      { label: "Investors", href: "/investors" },
    ],
  },
  {
    heading: "Work with us",
    links: [
      { label: "Sell your flax straw", href: "/sell-your-straw" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export const telHref = (number: string) => `tel:+${number.replace(/[^0-9]/g, "").replace(/^(?!1)/, "1")}`;
