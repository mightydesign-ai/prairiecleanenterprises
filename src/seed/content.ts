import type { Job, News, Partner, Product, SiteSetting, Team } from "@/payload-types";
import { richText } from "./lexical";

type New<T> = Omit<T, "id" | "createdAt" | "updatedAt" | "slug"> & { slug?: string };

export const siteSettings: Omit<SiteSetting, "id"> = {
  email: "info@prairiecleanenterprises.com",
  phones: [
    { label: "Toll free", number: "1-844-978-3529" },
    { label: "Local", number: "306-910-3529" },
  ],
  facility: {
    name: "Weyburn Production Facility",
    street: "54 Queen Street",
    locality: "North Weyburn",
    region: "SK",
    postalCode: "S0C 1X0",
  },
  social: [
    { label: "LinkedIn", url: "https://ca.linkedin.com/company/prairie-clean" },
    { label: "Facebook", url: "https://www.facebook.com/share/1CrczTmuyu/" },
    { label: "Instagram", url: "https://www.instagram.com/prairiecleanen" },
    { label: "X", url: "https://x.com/PrairieCleanEn" },
  ],
};

export const products: New<Product>[] = [
  {
    name: "Flax Fibre",
    slug: "flax-fibre",
    market: "b2b",
    order: 1,
    audience: "For pulp, paper and biomaterials",
    headline: "A secure, long-term supply of flax fibre",
    summary:
      "Low-shive fibre from Canadian flax straw, decorticated in Weyburn and baled for shipping worldwide. Built for buyers who need stable volume and steady pricing.",
    cardSummary: "Low-shive fibre for pulp, specialty paper, nitrocellulose and biomaterials.",
    primaryCtaLabel: "Talk to our fibre team",
    primaryCtaHref: "/contact",
    highlights: [
      { value: "Up to 1M", title: "tonnes of straw a year", text: "Flax straw grown each year on the Canadian and US prairies." },
      { value: "60,000+", title: "acres under agreement", text: "Long-term right-of-first-refusal agreements with growers." },
      { value: "2", title: "patents pending", text: "On our decortication process, developed in 2024." },
    ],
    applications: [
      { title: "Specialty paper", text: "Long, strong fibre for pulp and specialty paper mills in Europe and North America." },
      { title: "Biocomposites", text: "A renewable reinforcement for moulded parts and panels." },
      { title: "Technical textiles and nonwovens", text: "Feedstock for mats, insulation and industrial nonwovens." },
      { title: "Nitrocellulose", text: "A domestic alternative to cotton and wood cellulose, in development." },
    ],
    callout: {
      eyebrow: "Decortication",
      heading: "Cleaner fibre with less energy and time",
      text: "Our process separates fibre from the woody shive more efficiently than conventional lines, producing high-quality fibre with low shive content. The shive becomes pellets, so nothing is wasted.",
    },
    specs: [
      { label: "Shive content", value: "[SHIVE %]" },
      { label: "Fibre length", value: "[LENGTH MM]" },
      { label: "Moisture", value: "[MOISTURE %]" },
      { label: "Bale format", value: "[BALE SIZE AND WEIGHT]" },
    ],
  },
  {
    name: "Fuel Pellets",
    slug: "fuel-pellets",
    market: "b2b",
    order: 2,
    audience: "For industrial heat and power",
    headline: "Biomass pellets that burn like wood, made from straw",
    summary:
      "Agricultural pellets usually mean high ash and low heat. By removing the fibre first, our shive pellets match wood on ash and calorific value.",
    cardSummary: "Dense flax straw pellets that burn clean and hot, with low ash and moisture.",
    primaryCtaLabel: "Request a quote",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Ask for a test sample",
    secondaryCtaHref: "/contact",
    highlights: [
      { title: "Low ash", text: "Removing the fibre takes out most of the ash-forming material." },
      { title: "High calorific value", text: "Net heat value equivalent to wood pellets." },
      { title: "Low trace elements", text: "Mineral content far below typical agricultural fuels." },
      { title: "High durability", text: "Dense pellets that hold up in handling and storage." },
    ],
    callout: {
      eyebrow: "Proven in the field",
      heading: "Built for decarbonizing heavy industry",
      text: "With Saskatchewan Polytechnic, we're running a living-lab pilot to test flax straw bioheat for the potash industry. Third-party testing shows flax pellets can cut heat and power emissions by up to 90%.",
    },
    specs: [
      { label: "Net calorific value", value: "[MJ/KG]" },
      { label: "Ash content", value: "[ASH %]" },
      { label: "Moisture", value: "[MOISTURE %]" },
      { label: "Mechanical durability", value: "[DURABILITY %]" },
      { label: "Diameter", value: "[MM]" },
    ],
  },
  {
    name: "Prairie Clean Litter",
    slug: "cat-litter",
    market: "b2c",
    order: 3,
    audience: "At Co-op stores",
    headline: "No clay. No perfume. No cat pee smell.",
    summary:
      "A natural cat litter made from 100% Saskatchewan flax straw. It locks in ammonia odour, keeps dust down and tracks less through your home.",
    cardSummary: "Clay-free, low-dust cat litter that neutralizes ammonia odour.",
    primaryCtaLabel: "Find it near you",
    primaryCtaHref: "#buy",
    secondaryCtaLabel: "Buy online",
    secondaryCtaHref: "https://prairiecleanlitter.ca",
    consumerSiteUrl: "https://prairiecleanlitter.ca",
    retailOrderCode: "6095277",
    highlights: [
      { value: "3×", title: "More absorbent than clay", text: "And four times more than crystal litter, so you scoop less often." },
      { title: "Neutralizes ammonia", text: "Flax pellets trap ammonia, cutting the smell in the air around the box." },
      { title: "Low dust, low tracking", text: "Small, dense pellets stay in the box instead of on your floors." },
      { title: "Nothing added", text: "100% flax straw, unscented, with no clay or chemical additives." },
    ],
    whereToBuy: [
      { label: "In stores now", title: "Co-op", text: "In Co-op stores across Western Canada." },
      { label: "Online", title: "prairiecleanlitter.ca", text: "Order direct and have it shipped to your door.", href: "https://prairiecleanlitter.ca" },
      { label: "Coming soon", title: "Walmart Canada", text: "We earned a Walmart Canada Golden Ticket and will be online and in store." },
    ],
    callout: {
      eyebrow: "Giving back",
      heading: "$1 from every bag goes to local cats in need",
      text: "Each bag sold supports humane societies and cat rescues. Every cat adopted from the Regina Humane Society goes home with a free bag.",
    },
  },
  {
    name: "Prairie Clean Flax Bedding",
    slug: "animal-bedding",
    market: "both",
    order: 4,
    audience: "For horses, cattle and poultry",
    headline: "Muck out every few days, not every day",
    summary:
      "Highly absorbent, low-dust flax bedding for horses, cattle, pigs, poultry and small animals. Healthier air for animals and the people who care for them.",
    cardSummary: "Highly absorbent, compostable bedding that means less mucking out.",
    primaryCtaLabel: "Order bedding",
    primaryCtaHref: "https://prairiecleanbedding.com",
    secondaryCtaLabel: "Bulk and event orders",
    secondaryCtaHref: "/contact",
    consumerSiteUrl: "https://prairiecleanbedding.com",
    highlights: [
      { title: "Exceptional absorbency", text: "Typical mucking drops to every three or four days instead of daily." },
      { title: "Low dust", text: "Better for respiratory health in barns, show rings and stalls." },
      { title: "Low ammonia", text: "A lower pH absorbs ammonia, meaning less smell and healthier animals." },
      { title: "Compostable", text: "100% natural flax that breaks down when you're done with it." },
    ],
    applications: [
      { title: "Horses" },
      { title: "Cattle" },
      { title: "Pigs and poultry" },
      { title: "Rodeos and farm shows" },
    ],
    callout: {
      eyebrow: "Official bedding partner",
      heading: "Animals at Canadian Western Agribition bed down on our flax for the next five years",
      text: "Exhibitors at the 2025 show compared it with wood shavings side by side. Planning an event? We can supply it.",
    },
  },
];

const d = (iso: string) => new Date(`${iso}T12:00:00.000Z`).toISOString();

export const news: New<News>[] = [
  {
    title: "Prairie Clean Litter now in Co-op stores across Western Canada",
    kind: "video",
    source: "CTV News Regina",
    externalUrl: "https://guelph.ctvnews.ca/regina/article/co-op-and-prairie-clean-enterprises-partner-to-bring-local-cat-litter-to-shelves/",
    excerpt: "An exclusive deal with Federated Co-operatives puts our Weyburn-made litter on shelves.",
    publishedOn: d("2026-07-17"),
    topic: "products",
    featured: true,
  },
  {
    title: "Canadian Western Agribition signs a five-year bedding deal with PCE",
    kind: "article",
    source: "The Western Producer",
    externalUrl: "https://www.producer.com/livestock/canadian-western-agribition-signs-deal-with-new-bedding-supplier/",
    excerpt: "Show animals will bed down on Saskatchewan flax instead of wood shavings.",
    publishedOn: d("2025-12-04"),
    topic: "products",
  },
  {
    title: "Weyburn chosen for a world-first flax straw facility",
    kind: "article",
    source: "CTV News Regina",
    externalUrl: "https://www.ctvnews.ca/regina/article/sask-company-betting-big-on-flax-straw-with-plans-for-weyburn-processing-plant/",
    excerpt: "The plant brings over 30 full-time jobs and new straw contracts for local farmers.",
    publishedOn: d("2025-05-05"),
    topic: "facility",
  },
  {
    title: "Regina Humane Society partners with PCE on Saskatchewan-made cat litter",
    kind: "article",
    source: "Regina Humane Society",
    externalUrl: "https://reginahumanesociety.ca/sustainable-local-and-cat-approved-the-rhs-partners-with-prairie-clean-enterprises/",
    excerpt: "The shelter receives litter free, and every adopter takes home a bag.",
    publishedOn: d("2025-06-25"),
    topic: "products",
  },
  {
    title: "Prairie Clean Energy envisions power from flax pellets",
    kind: "article",
    source: "The Western Producer",
    externalUrl: "https://www.producer.com/news/company-envisions-power-from-flax-pellets/",
    excerpt: "How a business plan written to humour a friend became a flax straw company.",
    publishedOn: d("2024-06-19"),
    topic: "research",
  },
  {
    title: "PCE begins buying flax straw from local farmers",
    kind: "article",
    source: "Farms.com",
    externalUrl: "https://farms.com/news/pce-begins-buying-flax-straw-from-local-producers-199200.aspx",
    excerpt: "The first purchasing season for the company's flax pellets.",
    publishedOn: d("2023-08-10"),
    topic: "farmers",
  },
  {
    title: "Saskatchewan company to buy flax straw in the Gilbert Plains area",
    kind: "article",
    source: "Manitoba Co-operator",
    externalUrl: "https://www.manitobacooperator.ca/?p=205459",
    excerpt: "Flax straw from Manitoba becomes premium horse bedding pellets.",
    publishedOn: d("2023-08-28"),
    topic: "farmers",
  },
];

export const team: New<Team>[] = [
  {
    name: "Mark Cooper",
    role: "President and CEO · MBA, PMP",
    bio: "Leads strategy and operations, after 20 years in government relations. Serves on several local non-profit boards.",
    order: 1,
  },
  {
    name: "Trevor Thomas",
    role: "Founder and Board Chair",
    bio: "Secures supply contracts and industrial sales, drawing on an agricultural background.",
    order: 2,
  },
  {
    name: "Brita Lind",
    role: "Chief Strategy Officer",
    bio: "Leads strategy, brand and communications, with more than 20 years of marketing experience.",
    order: 3,
  },
  {
    name: "Mahmood Ebadian, PhD",
    role: "Chief Product and Supply Chain Development Officer",
    bio: "Leads research on feedstock supply and logistics, with 12+ years advising the biomass industry.",
    order: 4,
  },
  {
    name: "Hank Froese",
    role: "VP, Farmer Relations and Processing",
    bio: "30+ years at SWM International, the last 10 managing its Canadian flax straw operations.",
    order: 5,
  },
  {
    name: "Dr. Matthew Goodwin",
    role: "Director, UK and Europe",
    bio: "Director of the European Pellet Council and a specialist in biomass fuel quality and supply.",
    order: 6,
  },
];

export const partners: New<Partner>[] = [
  { name: "SaskFlax", url: "https://www.saskflax.com/", category: "industry", order: 1 },
  { name: "University of Saskatchewan", url: "https://www.usask.ca/", category: "academic", order: 2 },
  { name: "University of Regina", url: "https://www.uregina.ca/", category: "academic", order: 3 },
  { name: "University of British Columbia", url: "https://www.ubc.ca/", category: "academic", order: 4 },
  { name: "Saskatchewan Polytechnic", url: "https://saskpolytech.ca/", category: "academic", order: 5 },
  { name: "Innovation Saskatchewan", url: "https://innovationsask.ca/", category: "government", order: 6 },
  { name: "STEP", url: "https://sasktrade.com/", category: "government", order: 7 },
  { name: "Government of Saskatchewan", url: "https://www.saskatchewan.ca/", category: "government", order: 8 },
];

export const jobs: New<Job>[] = [
  {
    title: "General Labourer",
    slug: "general-labourer-weyburn",
    location: "Weyburn, SK",
    employmentType: "full_time",
    shift: "Day shift",
    summary:
      "The day-shift backbone of our facility: logistics, organizing and support so shift operators can stay focused on production. No technical experience needed.",
    about: richText(
      "This isn't an operator position, and no technical experience is required. We need someone dependable who likes to stay busy and can work with minimal supervision.",
    ),
    responsibilities: [
      { title: "Yard work", text: "Snow removal, mowing and clearing debris year-round." },
      { title: "Night shift prep", text: "Consumables, tools, fuel and supplies ready before night shift starts." },
      { title: "Parts and supply runs", text: "Pick up and deliver what operators and maintenance need." },
      { title: "Tools and inventory", text: "Keep the tool room clean and stocked; flag damaged or missing items." },
      { title: "Facility support", text: "Move materials, stage work areas and lend a hand on the floor." },
      { title: "Errands", text: "Hardware and courier runs in a company vehicle, with a basic trip log." },
    ],
    requirements: [
      { text: "A valid driver's licence" },
      { text: "A self-starter attitude and strong work ethic" },
      { text: "Comfort working in a shop or industrial setting" },
      { text: "Clear communication skills" },
      { text: "Reliability and punctuality, working with minimal supervision" },
    ],
    open: true,
    postedOn: d("2026-10-01"),
  },
];
