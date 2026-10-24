import type { Page } from "@/payload-types";
import { richText } from "./lexical";

type SeedPage = Omit<Page, "id" | "createdAt" | "updatedAt"> & { draft?: boolean };

export const homePage: SeedPage = {
  title: "Home",
  slug: "home",
  meta: { title: "Prairie Clean Enterprises | Flax fibre, fuel and pellets" },
  layout: [
    {
      blockType: "hero",
      heading: "Discovering value from unutilized agricultural residue",
      primary: { label: "Contact us", href: "/contact" },
      secondary: { label: "Discover our products", href: "#products" },
    },
    {
      blockType: "productList",
      eyebrow: "Our products",
      heading: "Discover our signature innovations",
    },
    {
      blockType: "richText",
      tone: "tinted",
      eyebrow: "Flax fibre abundancy",
      heading: "Flax is an abundant, secure crop in Canada",
      content: richText(
        "Over 750,000 tonnes of flax straw are produced annually on the Canadian prairies. Of all the flax grown worldwide, 40% is produced in Canada. Most of which is grown in the same province as PCE's head office, Saskatchewan.",
        "Unlike other areas around the world, Canadians grow flax for its highly nutritious seeds. The seeds are harvested, but the flax straw is almost always burned in fields as it has no nutritional value and is too fibrous to be tilled back into the soil.",
      ),
    },
    {
      blockType: "richText",
      eyebrow: "Efficient, clean fibre decortication",
      heading: "The most efficient decortication process on the planet",
      content: richText(
        "In early 2024, our team researched an innovative decortication process. It has two-patents pending and continue to develop our ground-breaking process to remove the fibre from the shive in the most efficient process on the planet.",
        "Our approach uses less energy and takes less time, while producing high quality flax fibre with low shive content. There are no facilities like ours in the world that produce both high-quality flax fibre and flax shive pellets for both bio-materials and bioenergy/biofuels markets.",
      ),
    },
    {
      blockType: "cards",
      tone: "dark",
      eyebrow: "PCE aggregates & processes unutilized agricultural residue",
      heading: "A low-carbon input for diverse industries",
      intro:
        "PCE is a solution provider developing the bioeconomy landscape in North America and the world by doing what no one else is doing – harnessing the millions of tonnes of excess agricultural waste on the Canadian and American prairies. PCE's core strategy is a rigorous focus on efficiently gathering and processing fibre-rich and energy-dense straw and other sources of organic waste for diverse uses. Our feedstock is technologically and product agnostic and can be a low-carbon input solution for:",
      items: [
        { title: "Flax Fibre", text: "For use in pulp, specialty paper, and biomaterial industries" },
        { title: "Bioenergy", text: "Heat and power" },
        { title: "Transport Biofuels", text: "Sustainable Aviation Fuel (SAF) & hydrogen" },
        { title: "Industrial Absorbents", text: "For industrial cleanups and spill remediation" },
        { title: "Animal Bedding", text: "Horse, cow, pig, poultry & small animals" },
        { title: "Decarbonization", text: "Renewable Natural Gas (RNG)" },
      ],
    },
    { blockType: "newsList", heading: "In the news", limit: 3 },
    { blockType: "partners", heading: "Partners" },
    {
      blockType: "cta",
      tone: "dark",
      heading: "The world needs secure, abundant agricultural feedstock & flax fibre",
      text: "PCE is about leading technologies for the utilization of agricultural residue for feedstock and flax fibre on the Canadian and US prairies. What the world needs, starts here.",
      button: { label: "Contact us today", href: "/contact" },
    },
  ],
};

export const otherPages: SeedPage[] = [
  {
    title: "About PCE",
    slug: "about",
    breadcrumbParent: "company",
    meta: { description: "PCE turns unused prairie flax straw into fibre and pellets at the world's first flax straw multi-processing facility." },
    layout: [
      {
        blockType: "hero",
        heading: "We started because farmers had to burn their flax straw",
        intro:
          "Founded in 2020 by Trevor Thomas, PCE connects flax growers with buyers who need clean fibre and biomass. Today we run the world's only flax straw multi-processing facility, in Weyburn.",
      },
      {
        blockType: "richText",
        eyebrow: "Our story",
        heading: "A waste product with nowhere to go",
        content: richText(
          "Flax straw has no nutrients and is too fibrous to till back into the soil. For years, Trevor Thomas watched acres of it burn near his home in rural Saskatchewan.",
          "He saw a clean fuel and a source of fibre instead. PCE was set up to bridge the gap between flax growers and the companies that need sustainable biomass and high-value materials.",
          "We keep developing the collection and processing technology behind it, in partnership with farmers, universities and customers across Canada and abroad.",
        ),
      },
      {
        blockType: "cards",
        tone: "tinted",
        items: [
          { title: "Purpose", text: "Invest in our communities and lead the world in putting unused agricultural and organic waste to work." },
          { title: "Vision", text: "Become the world-class aggregator and processor of prairie agricultural and organic waste." },
          { title: "Mission", text: "Create and lead sustainable crop residue aggregation and processing on the Canadian prairies." },
        ],
      },
      {
        blockType: "milestones",
        heading: "From business plan to store shelves",
        items: [
          { date: "2020", text: "Trevor Thomas founds Prairie Clean Energy in Regina." },
          { date: "Jun 2023", text: "$1.1M grant from the MICA Network for flax pellet research." },
          { date: "Aug 2023", text: "First purchases of flax straw from prairie farmers." },
          { date: "Early 2024", text: "Patent-pending decortication process developed." },
          { date: "Apr 2025", text: "Weyburn chosen for the world-first processing facility." },
          { date: "Dec 2025", text: "Five-year bedding deal with Canadian Western Agribition." },
          { date: "Jul 2026", text: "Prairie Clean Litter launches in Co-op stores." },
        ],
      },
      {
        blockType: "cards",
        tone: "dark",
        eyebrow: "Why Saskatchewan",
        heading: "Almost a third of the world's flax grows here",
        items: [
          { title: "Abundant supply", text: "Saskatchewan produces more than 40% of Canada's agricultural output, and flax is already in growers' rotations." },
          { title: "Reliable infrastructure", text: "Two national rail lines and a transcontinental highway move product to ports and customers." },
          { title: "Farmer relationships", text: "We are the only flax straw buyer in Saskatchewan registered with SaskFlax." },
          {
            title: "Stable place to invest",
            text: "Canada offers clear, fair regulation, and our research partners include the Universities of Saskatchewan and Regina and Saskatchewan Polytechnic.",
          },
        ],
      },
      { blockType: "team", heading: "Leadership team" },
      {
        blockType: "cta",
        heading: "Want to work with us, sell us straw or buy our products?",
        button: { label: "Get in touch", href: "/contact" },
      },
    ],
  },
  {
    title: "Sustainability",
    slug: "sustainability",
    meta: { description: "How turning flax straw into fibre and pellets cuts field burning, replaces fossil heat and leaves nothing for landfill." },
    layout: [
      {
        blockType: "hero",
        heading: "Every bale we buy is a bale that isn't burned",
        intro:
          "Turning flax straw into fibre and pellets cuts field burning, replaces fossil heat, uses no water and leaves nothing for landfill.",
      },
      {
        blockType: "stats",
        heading: "What one year at scale looks like",
        items: [
          { value: "85,000 t", label: "of flax straw collected instead of burned" },
          { value: "75,000 t", label: "of flax fibre and pellets produced" },
          { value: "1,700 cars", label: "taken off the road, in equivalent yearly emissions avoided" },
        ],
        footnote:
          "Burning one tonne of flax straw releases about 80 kg CO₂e. Burning 50 tonnes equals a typical car's emissions for a year, about 4 tonnes.",
      },
      {
        blockType: "cards",
        tone: "tinted",
        heading: "Benefits across the value chain",
        items: [
          { tag: "Climate", title: "Up to 90% lower emissions for heat and power", text: "Industries that burn fossil fuels for heat can switch to flax pellets and cut emissions deeply." },
          { tag: "Air", title: "Less smoke over prairie fields", text: "Most flax straw is burned after harvest. Buying it removes that source of air pollution and greenhouse gas." },
          { tag: "Water", title: "No water used", text: "Pellet production uses no water, so there is no risk of water contamination from straw to bioheat." },
          { tag: "Waste", title: "Nothing to landfill", text: "No chemicals go into our pellets, and the process leaves no by-products that need disposal." },
          { tag: "Farmers", title: "A new income stream from straw", text: "A market for straw that had no value makes flax more attractive to grow." },
          { tag: "Community", title: "30+ jobs in Weyburn", text: "The facility adds full-time jobs and work for local balers, haulers and storage businesses." },
        ],
      },
      {
        blockType: "cards",
        eyebrow: "Independent testing",
        heading: "Claims checked by third-party labs",
        items: [
          { title: "Econotech, Delta, BC", text: "Independent testing of fibre and pellet properties." },
          { title: "Biomass and Bioenergy Research Group, UBC", text: "Combustion and fuel quality analysis." },
          { title: "ISO solid biofuel standards", text: "Our flax pellets met ISO quality standards for solid biofuels in May 2025." },
        ],
      },
      {
        blockType: "cta",
        tone: "dark",
        heading: "Decarbonizing industrial heat? Talk to us about flax pellets.",
        button: { label: "See fuel pellets", href: "/products/fuel-pellets" },
      },
    ],
  },
  {
    title: "Sell your flax straw",
    slug: "sell-your-straw",
    meta: { description: "Sell your flax straw to PCE. Bale requirements, payment terms and a straw offer form for prairie flax growers." },
    layout: [
      {
        blockType: "hero",
        eyebrow: "For flax growers",
        heading: "Get paid for straw you'd otherwise burn",
        intro:
          "We've bought flax straw every year since 2022, and more each year than the last. Tell us what you have and we'll send you a contract.",
        primary: { label: "Start a straw offer", href: "#offer" },
        secondary: { label: "Call 1-844-978-3529", href: "tel:+18449783529" },
        stat: { value: "25,000+", label: "tonnes bought from the 2025 harvest" },
      },
      {
        blockType: "cards",
        tone: "tinted",
        heading: "What we buy",
        intro: "Our priority is southeastern Saskatchewan, but we want to hear from growers anywhere who can bale and haul to Weyburn.",
        items: [
          { title: "At least 900 lb", text: "per bale" },
          { title: "15% moisture or less" },
          { title: "Rock free", text: "with minimal weeds" },
          { title: "Round or large-square", text: "bales, stored on your farm" },
        ],
      },
      {
        blockType: "steps",
        heading: "How we pay",
        items: [
          { title: "Send us your offer", text: "Use the form below." },
          { title: "Get a contract by email", text: "If you're in our purchasing area." },
          { title: "¼ paid on confirmation", text: "Once we confirm your stored bales." },
          { title: "¾ paid at pickup", text: "Deliver it yourself or we arrange trucking; transport is paid on top, by distance." },
        ],
      },
      {
        blockType: "form",
        form: "straw",
        anchor: "offer",
        heading: "Start a straw offer",
        intro: "Takes about three minutes. Fields marked * are required.",
      },
      {
        blockType: "faq",
        heading: "Questions from growers",
        items: [
          {
            question: "I didn't grow flax this year. Can I still sign up?",
            answer:
              "Yes. A Right of First Refusal (ROFR) is a flexible five-year agreement: if you grow flax, we get the first chance to negotiate for your straw. You don't have to grow flax every year or sell only to us if terms don't suit you.",
          },
          {
            question: "What if I'm outside the purchasing area?",
            answer:
              "Send an offer anyway. We're expanding the area as production grows, and we can buy from growers who can bale and haul to us within our purchase budget.",
          },
          {
            question: "Who arranges and pays for trucking?",
            answer: "You can deliver yourself, or we arrange it. Transport is paid in addition to the bale price, based on distance.",
          },
          {
            question: "I'm interested in investing in PCE.",
            answer: "If you're an accredited investor, see our investor page at /investors.",
          },
        ],
      },
    ],
  },
  {
    title: "Investors",
    slug: "investors",
    meta: { description: "Invest in Prairie Clean Enterprises: in production, on Co-op shelves and raising to scale. Accredited investors only." },
    layout: [
      {
        blockType: "hero",
        heading: "In production, on shelves, and raising to scale",
        intro:
          "PCE is a 100% Canadian company making 100% Canadian products. Our current round funds national and international growth.",
        primary: { label: "Request the investor package", href: "#inquire" },
      },
      {
        blockType: "stats",
        tone: "tinted",
        items: [
          { value: "30,000 sq ft", label: "facility operating in Weyburn" },
          { value: "Co-op", label: "exclusive, on shelves across Western Canada" },
          { value: "Walmart", label: "Canada Golden Ticket, online and in store" },
        ],
      },
      {
        blockType: "cards",
        eyebrow: "Current round · accredited investors only",
        heading: "Two ways to invest",
        items: [
          { title: "Equity: $7 CAD per share", text: "Minimum investment $50,000 CAD." },
          { title: "Debt: 10% annual interest", text: "Compounded monthly. Minimum investment $100,000 CAD." },
          { title: "Registered accounts", text: "Invest through a TFSA, RRSP or LIRA; ask us for details." },
          { title: "Tax credit", text: "Saskatchewan investments may qualify for the 45% SMEITC provincial credit, which is capped and first-come." },
        ],
      },
      {
        blockType: "form",
        form: "investor",
        anchor: "inquire",
        heading: "Request the investor package",
        intro: "We email the package to accredited investors.",
      },
      {
        blockType: "richText",
        content: richText(
          "This page contains forward-looking statements; no assurance is given that projected outcomes will occur. Investing involves risk. Accredited investors only. Speak with a PCE representative about the specifics of the debt and equity options.",
        ),
      },
    ],
  },
  {
    title: "Contact",
    slug: "contact",
    meta: { description: "Contact Prairie Clean Enterprises at our Weyburn production facility." },
    layout: [
      {
        blockType: "hero",
        heading: "Let's get started",
        intro: "Tell us what you need and we'll route your message to the right person. Selling flax straw? Use the straw offer form instead.",
        primary: { label: "Sell your flax straw", href: "/sell-your-straw" },
        secondary: { label: "Investor package", href: "/investors" },
      },
      { blockType: "form", form: "contact", heading: "Send us a message" },
    ],
  },
  {
    title: "Privacy policy",
    slug: "privacy",
    draft: true,
    layout: [
      {
        blockType: "richText",
        heading: "Privacy policy",
        content: richText("[PCE to supply privacy policy text before launch. Publish this page once it's in.]"),
      },
    ],
  },
];
