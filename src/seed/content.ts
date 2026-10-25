import type { Job, News, Partner, Product, SiteSetting, Team } from "@/payload-types";
import { richText } from "./lexical";

type New<T> = Omit<T, "id" | "createdAt" | "updatedAt" | "slug"> & { slug?: string };

export const siteSettings: Omit<SiteSetting, "id"> = {
  email: "info@prairiecleanenterprises.com",
  phones: [
    { label: "Toll free", number: "1 (844) 978-3529" },
    { label: "Local", number: "1 (306) 910-3529" },
  ],
  facility: {
    name: "Weyburn Production Facility",
    street: "54 Queen St",
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
    cardSummary: "Extracted through our unique process, our flax fibre serves as sustainable pulp, paper, and biomaterials.",
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
    sections: [
      {
        eyebrow: "PCE Flax Fibre",
        heading: "Secure, abundant supply of flax fibre",
        body: richText(
          "Canada is the largest producer of flax seed in the world, as a result there is up to 1 million of tonnes of flax straw available on the Canadian and US prairies. PCE is the only company in this space–ahead of anyone–with thousands of acres of flax straw under contract and a revolutionary innovative and sustainable way to efficiently produce flax fibre. This allows PCE to work with companies who need long-term, stable supply of flax fibre to help them gain market advantage, solve long-term supply issues, counter environmental or global variables, while remaining quality and price competitive.",
          "At PCE, our core business is a rigorous focus on efficiently gathering and processing un-utilized agricultural residue, firmly focused on flax straw. We have an abundant supply of high-quality flax straw from which to produce flax fibre. Contact us today.",
        ),
      },
      {
        eyebrow: "Efficient, clean fibre decortication",
        heading: "The most efficient process on the planet",
        imagePlaceholder: true,
        body: richText(
          "In early 2024, our team developed an innovative decortication process. It has two-patents pending. Our ground-breaking process removes the fibre from the shive in the most efficient process on the planet. Our approach uses less energy and takes less time, while producing high quality flax fibre with low shive content. There are no facilities like ours in the world that produce both high-quality flax fibre and flax shive pellets for both bio-materials and bioenergy/biofuels markets.",
        ),
      },
      {
        heading: "Flax Derived Cellulose for Nitrocellulose",
        imagePlaceholder: true,
        body: richText(
          "PCE has access to an abundant Canadian agricultural feedstock and is developing flax derived cellulose as a secure, domestically sourced alternative to traditional cotton-and wood-derived cellulose feedstocks for nitrocellulose production.",
          "Canada is seeking to strengthen its sovereign industrial and defence supply chains, including the development of domestic nitrocellulose production using Canadian-sourced cellulose. PCE is proud to be aligned with this vision, working to develop a home-grown cellulose feedstock that can support Canadian nitrocellulose production and contribute to security of supply for Canada and its allies.",
        ),
      },
      {
        heading: "PCE Flax Fibre Applications and Industries",
        body: richText(
          "Once decorticated from the straw, we bale the flax fibre for shipping worldwide, where it can be used in:",
          { list: ["Specialty paper", "Biocomposites", "Technical Textiles & Nonwovens", "Nitrocellulose"] },
        ),
      },
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
    cardSummary: "Produced from flax straw, our biomass pellets offer a low-carbon, efficient energy source for heat and power.",
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
      { label: "Diameter", value: "6 ± 1 mm" },
      { label: "Length", value: "3.15 ≤ L ≤ 40 mm" },
      { label: "Bulk density", value: "≥ 600 kg/m³" },
      { label: "Mechanical durability", value: "≥ 97.5 %" },
      { label: "Ash deformation", value: "≥ 1200 °C" },
      { label: "Net calorific value", value: "≥ 16.5 GJ/ton" },
      { label: "Ash (dry basis)", value: "≤ 3 %" },
      { label: "Moisture", value: "≤ 10 %" },
      { label: "Additives", value: "None" },
      { label: "Chlorine (dry basis)", value: "≤ 0.1 %" },
      { label: "Nitrogen (dry basis)", value: "≤ 1 %" },
      { label: "Sulfur (dry basis)", value: "≤ 0.1 %" },
    ],
    sections: [
      {
        eyebrow: "Fuel pellets",
        heading: "A Technically Viable Pathway to Decarbonization",
        body: richText(
          "The current global pellet production capacity has been built around the use of forest biomass resources, mainly sawmill residues. Forest and agricultural biomass resources have different physical, chemical and thermal properties, calling for the modification of the existing biomass processing equipment such as shredding, grinding, drying and pelletization. In the last three years, PCE in collaboration with its university partners has been conducting lab experiments to deeply understand these property differences and develop a technically viable pathway for flax straw as its main feedstock for fuel pellet production. Development of a technically viable pathway for the production of dense and durable feedstocks from flax straw and other crop residues.",
          "With the financial support from Innovation Saskatchewan, under a Saskatchewan Advantage Innovation Fund (SAIF) project, PCE in collaboration with its academic and industrial partners, was able to successfully develop a proprietary flax straw pellet production process and filed a preliminary patent application in 2022.",
          "Having a technically viable production pathway for flax straw and other underutilized crop residues that is replicable to various locations in the Canadian and US prairies is a critical step to encourage the use of crop residues for bioenergy, biofuels and other bioproduct markets in commercial quantities.",
          "Tens of millions of tonnes of fuel pellets are used globally to generate heat and power. To date, the vast majority of these have been produced using trees.",
          "Historically, pellets produced from agricultural residues, or even energy crops, have been used but in much lower volumes due to their challenging combustion and physical characteristics, such as high ash content, low calorific value, and high concentrations of elemental compounds – all issues PCE fuel pellets overcome.",
          "PCE Pellets are excellent fuel pellets due to: Low ash, High calorific value, Low trace element concentrations, and High durability.",
          "In collaboration with our university partners, PCE has been developing an in-depth lab testing to confirm the technical and chemical properties of flax straw to develop a technically viable pathway for flax straw as our main feedstock for pellet production for customers.",
        ),
      },
      {
        heading: "Pelletization innovation",
        body: richText(
          "Forest and agricultural biomass resources have different physical, chemical and thermal properties, calling for the modification of the existing biomass processing equipment such as shredding, grinding, drying, and pelletization.",
          "With financial support from Innovation Saskatchewan, under a Saskatchewan Advantage Innovation Fund (SAIF) project, PCE in collaboration with its academic and industrial partners, has successfully developed a proprietary flax straw pellet production process and filed two preliminary patent applications in 2022.",
        ),
      },
      {
        heading: "Fuel pellets made from flax straw",
        imagePlaceholder: true,
        body: richText(
          "Flax straw pellets come from the flax (or linseed) plant. Flax straw is a waste by-product of harvesting flax seed. The straw has no nutrients, cannot be tilled into the soil, and has no market value. Farmers have almost no choice but to burn the straw in field. However, flax straw is an excellent fuel source. It burns cleanly and hotly, generating very low ash content and a high net calorific value. PCE has developed a patent-pending process to transform this straw into pellets for the biomass industry. More than 1.5 million tonnes of flax straw are produced on the Canadian and US prairies every year.",
        ),
      },
      {
        heading: "Environmental Benefits of Flax Straw",
        body: richText(
          "Flax straw is a genuine agricultural residue. Flax straw is a by-product of harvesting flax seed. The straw has no nutrients, cannot be tilled into the soil, and has no market value. Farmers have almost no choice but to burn the straw in the field.",
          "Up to 1 million tonnes of flax straw are produced by farmers on the Canadian and US prairies every year. PCE is the only company working closely with these farmers to provide an avenue for them to dispose of this straw rather than burning it.",
          "Canada produces 40% of all global flax, and the amount of flax straw produced annually on the Canadian prairies is well over 750,000 tonnes.",
          "As a staple of Canadian agriculture, flax is already part of farmers’ annual crop rotations. The straw is a residue after the flax has been harvested. It has no nutrient value and must be removed from the field. With no market for this waste, most of the straw is burned in the field.",
          "As tested, flax straw can meet ISO standards. Flax straw has a very low ash content and low moisture levels. The chemical composition of flax straw is appropriate for power and heat generation, with mineral content far below typical agricultural fuel sources. Most importantly, flax straw has high net calorific value equivalent to wood.",
          "PCE’s products are all independently tested and verified. Testing labs include Econotech (from Delta, British Columbia, Canada) and the Biomass and Bioenergy Research Group (from the University of British Columbia).",
        ),
      },
      {
        heading: "Decortication innovation",
        body: richText(
          "Flax straw is made up of an outer fibrous layer and an inner woody core (shive). PCE fuel pellets are of a quality comparable to those produced from wood and here’s why:",
          "In early 2024, PCE started developing a proprietary decortication process to separate the fibre and shive constituents of flax straw. By removing the fibre, we’re removing the highest concentration of trace chemicals and resulting ash. The woody shive is ideal for processing using our patent-pending pelleting process. Once seperated the fibre is baled and has multiple uses including for textiles, paper, and bio-composites.",
          "On the other hand, the shive is remarkably similar to wood, exhibiting many of the properties for which woody biomass is so highly valued: Low ash content & High calorific value.",
          "*All threshold values are ‘as received’ unless stated otherwise, and percentages are by weight.",
        ),
      },
      {
        heading: "The flax plant",
        imagePlaceholder: true,
        body: richText(
          "Flax is a slender plant with pale blue flowers grown as an annual crop for its seeds and fibre. It is used in industrial applications, food production, textiles manufacturing, and as animal fodder. In Canada, the vast majority of flax is harvested for its seeds and the straw fibre is discarded as waste.",
          "Prairie Clean Enterprises is the only Saskatchewan-based registered buyer of flax straw. For more information on flax and the flax industry, visit SaskFlax (saskflax.com) or the Flax Council of Canada (flaxcouncil.ca).",
        ),
      },
      {
        eyebrow: "Future PCE product",
        heading: "Fuel pellets",
        imagePlaceholder: true,
        body: richText(
          "Saskatchewan is Canada’s “ breadbasket,” with agricultural production representing more than 40% of Canada’s total. You can see crops like barley, canola, canary, hemp, wheat and many more growing in its vast fields. All of these crops result in an abundance of un-utilized agricultural residue – waste that has no other purpose. PCE is uniquely positioned to bring this residue, all 48 million tonnes of it, to the biomass pellet market. We’re offering a clean, renewable, abundant, and secure fuel source.",
        ),
      },
    ],
  },
  {
    name: "Prairie Clean Litter",
    slug: "cat-litter",
    market: "b2c",
    order: 3,
    audience: "A Canadian clay-free, odour-smart, sustainable choice for pet owners",
    headline: "No clay. No perfume. No cat pee smell.",
    summary:
      "A natural cat litter made from 100% Saskatchewan flax straw. It locks in ammonia odour, keeps dust down and tracks less through your home.",
    cardSummary: "Prairie Clean Cat Litter is 100% natural, ammonia-neutralizing, highly absorbent, and low in odour and dust.",
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
    sections: [
      {
        eyebrow: "Prairie Clean Cat Litter",
        heading: "Support Local. Support a Superior Product. Choose Prairie Clean.",
        imagePlaceholder: true,
        body: richText(
          "Give your customers a healthier, more natural choice for their pets while supporting sustainable farming in Saskatchewan. Order Prairie Clean Cat Litter today.",
          "prairiecleanlitter.ca",
        ),
      },
      {
        eyebrow: "In the news!",
        heading: "Regina Humane Society partnership",
        body: richText(
          "The Regina Humane Society has teamed up with Prairie Clean Enterprises to introduce Prairie Clean Litter, a 100% flax-straw based environmentally friendly cat litter.",
          "The shelter will receive the litter free of charge, and new adopters will get a complimentary bag or voucher. One dollar from every bag sold will support local Humane Societies or cat rescues in your area.",
        ),
      },
      {
        eyebrow: "In the news!",
        heading: "Exclusive deal with Federated Co-op Limited",
        body: richText(
          "Prairie Clean Litter has signed an exclusive deal with Federated Co-op Limited, bringing our Saskatchewan-made cat litter to Co-op stores across Western Canada. Proudly produced in Weyburn, SK, Prairie Clean Litter is made entirely from Canadian flax straw, an agricultural by-product that is often burned.",
          "Want to see Prairie Clean Litter at your local Co-op? Visit your nearest Co-op and ask customer service to carry Prairie Clean Litter using order #6095277.",
        ),
      },
    ],
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
    cardSummary: "Our animal bedding offers exceptional absorbency and comfort, promoting healthier livestock, & easier maintenance.",
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
    sections: [
      {
        eyebrow: "Prairie Clean Flax Bedding",
        heading: "PCE flax premium bedding… for horses, cows, poultry, and small animals",
        imagePlaceholder: true,
        body: richText(
          "Made from 100% Natural Flax Fibre",
          "Flax fibre is tried, tested, and loved in Europe and the USA for animal bedding due to the benefits of low dust, exceptional absorbency, low ammonia release, and its compostable/biodegradable nature. Ideal for horses/equine, cows, pigs, poultry, and small animals",
          "prairiecleanbedding.com",
        ),
      },
    ],
  },
];

const d = (iso: string) => new Date(`${iso}T12:00:00.000Z`).toISOString();

/** Excerpts are capped at 400 characters in the News collection. */
const ex = (text: string) => {
  if (text.length <= 400) return text;
  const cut = text.slice(0, 397);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

type NewsSeed = {
  title: string;
  date: string;
  source: string;
  url?: string;
  kind?: "article" | "video" | "announcement";
  topic: "products" | "facility" | "farmers" | "research" | "funding";
  text: string;
  body?: string[];
  featured?: boolean;
  slug?: string;
};

const newsItems: NewsSeed[] = [
  {
    title: "Prairie Clean Litter Now Available At Co-op Locations Across Western Canada!",
    date: "2026-07-17",
    source: "CTV News Regina",
    url: "https://www.youtube.com/watch?v=28tnLxvePYQ",
    kind: "video",
    topic: "products",
    featured: true,
    text: "Prairie Clean Enterprises is excited to announce that we signed an exclusive deal with Federated Co-op Limited, bringing our Saskatchewan-made cat litter to Co-op stores across Western Canada. Proudly produced in Weyburn, SK, Prairie Clean Litter is made entirely out of Flax straw, an agricultural by-product that is often burned. No more cat pee smell. Low dust. Low tracking. Want to see Prairie Clean Litter at your local Co-op? Visit customer service and ask them to carry it using order #6095277.",
  },
  {
    title: "Canadian Western Agribition signs deal with new bedding supplier",
    date: "2025-12-04",
    source: "The Western Producer",
    url: "https://www.producer.com/crops/canadian-western-agribition-signs-deal-with-new-bedding-supplier/",
    topic: "products",
    text: "Prairie Clean Enterprises is excited to become a future bedding partner for Canadian Western Agribition. PCE recently launched Prairie Clean Flax Bedding — a 100% natural, Saskatchewan-made bedding that is highly absorbent, low in dust, and more sustainable than traditional options. CEO, Mark Cooper says the product “produces less dust, which means healthier animals and people,” adding that Agribition will help showcase “a Saskatchewan-made product, the first of its kind in the world.”",
  },
  {
    title: "Turning Residue Into Power: Prairie Clean Enterprises' bioheat solution set to support deep decarbonization of potash production",
    date: "2025-11-17",
    source: "The Potash Producer",
    url: "https://flipbooks.delcommunications.com/PP2025-3#page/25",
    topic: "research",
    text: "Prairie Clean Enterprises is using flax straw to help reduce emissions and support a lower-carbon future for one of Saskatchewan’s most important industries: Potash production. By transforming underutilized agricultural residue into a valuable energy source, PCE is creating new opportunities for Prairie agriculture while supporting decarbonization efforts. CEO, Mark Cooper explains, “our technology allows potash producers to use a renewable, Saskatchewan-made fuel that could reduce GHG emissions by as much as 80 percent.”",
  },
  {
    title: "Flax straw plant planned for southeastern Sask.",
    date: "2025-08-01",
    source: "The Western Producer",
    url: "https://www.producer.com/markets/flax-straw-plant-planned-for-southeastern-sask/",
    topic: "facility",
    text: "Prairie Clean Enterprises is gearing up to launch the world’s first flax straw processing facility in Weyburn, Saskatchewan. CSO, Brita Lind, shares how this facility will turn flax straw into high-value, sustainable products, including Prairie Clean Litter. Once operational, the facility will process up to 50,000 tonnes of flax straw annually, supporting prairie farmers, creating new jobs, and driving clean innovation in agriculture.",
  },
  {
    title: "Sask. Company Using Flax Waste to Create Sustainable Cat Litter",
    date: "2025-07-03",
    source: "CBC News",
    url: "https://www.cbc.ca/news/science/what-on-earth-us-climate-activists-1.7575978",
    topic: "products",
    text: "Prairie Clean Enterprises featured on What On Earth– CBC’s weekly national newsletter dedicated to climate solutions and environmental innovation from across Canada. PCE is committed to stopping the practice of burning flax straw in fields by repurposing this agricultural waste into useful products, one of which being an eco-friendly cat litter. CEO Mark Cooper discusses the environmental benefits of Prairie Clean Litter and why people should make the switch.",
  },
  {
    title: "Regina Humane Society Partners with Prairie Clean Enterprises to Introduce Sustainable, Saskatchewan-Made Cat Litter",
    date: "2025-06-25",
    source: "Regina Humane Society",
    kind: "announcement",
    topic: "products",
    text: "The Regina Humane Society (RHS) is proud to announce a new partnership with Prairie Clean Enterprises (PCE), a Saskatchewan-based company, to introduce a locally-produced, flax-straw-based Cat litter at the Society’s Animal Community Centre.",
    body: [
      "The Regina Humane Society (RHS) is proud to announce a new partnership with Prairie Clean Enterprises (PCE), a Saskatchewan-based company, to introduce a locally-produced, flax-straw-based Cat litter at the Society’s Animal Community Centre",
      "The RHS worked with PCE in 2024 on a trial study of the environmentally friendly litter, made from flax straw – a renewable by-product of Saskatchewan’s agriculture industry – where it proved to be a clean and effective solution for feline care in shelter. The trial study demonstrated the effectiveness of the all-natural, no-additives, cat litter in odour, dust, and tracking control.",
      "“This partnership is an exciting step forward in both animal welfare and environmental responsibility,” said Bill Thorn, Director of Marketing and Public Relations at the Regina Humane Society. “Not only does this product perform well in our shelter, but it also reflects our commitment to supporting local innovation and sustainability.”",
      "As part of the partnership, PCE will supply the flax-straw-based litter – called Prairie Clean Litter – to the Regina Humane Society at no cost. This generous commitment will allow the Society to redirect more resources toward the direct care of animals, as well as its broader humane education, adoption, and community outreach programs.",
      "Additionally, every adopter who welcomes a cat or kitten into their home from the RHS will be provided a complimentary bag of litter or a voucher to obtain one through the Prairie Clean Litter website. Moreover, one dollar from every bag of Prairie Clean Litter sold will go to local feline health and welfare.",
      "“We are grateful for this partnership with RHS. They are so critical to animal welfare and adoption in Regina,” said Mark Cooper, PCE’s CEO and President. “It’s a win-win-win partnership. It’s a win for the prairie farmers PCE can buy more flax straw from, it’s a win for the environment as less flax straw will be burned in the fields, and it’s a win for consumers and their cats who can buy a true Canadian product that is a healthy and effective, eco-friendly solution.”",
      "The new program is set to roll out in October of this year, marking the beginning of what both organizations see as a model of local collaboration and sustainability in action.",
      "Up to 1 million tonnes of flax straw is burned on the North American prairies every year. PCE is the leading aggregator and processor of agricultural residue in Canada for flax straw and flax fibre for a variety of high-quality, value-added products. PCE’s first facility in Weyburn, Saskatchewan, will be in production September 2025, producing cat litter, animal bedding, and flax fibre. It will be the only flax straw multi-processing facility in the world.",
      "To learn more about Prairie Clean Litter and to sign up for when the product is available to the public, consumers can visit prairiecleanlitter.ca",
    ],
  },
  {
    title: "New and Improved, Saskatchewan-based Cat Litter",
    date: "2025-06-26",
    source: "CTV News",
    url: "https://www.youtube.com/watch?v=mrqqilYjlXA",
    kind: "video",
    topic: "products",
    text: "The Regina Humane Society has teamed up with Prairie Clean Enterprises to introduce Prairie Clean Litter, a 100% flax‑straw based, environmentally friendly cat litter. The shelter will receive the litter free of charge and new adopters will get a complimentary bag or voucher. One dollar from every bag sold will support local feline welfare.",
  },
  {
    title: "Prairie Clean Enterprises reached a new milestone to produce flax pellets that meet ISO quality standards for solid biofuels",
    date: "2025-05-26",
    source: "PCE",
    kind: "announcement",
    topic: "research",
    text: "Agricultural biomass, such as flax straw, plays a limited role in local and global bioenergy markets due to its generally lower quality compared to woody biomass. Among the ISO 17225 quality parameters for solid biofuels, mechanical durability is particularly critical, as it reduces dust generation during handling, transport, storage, and combustion.",
    body: [
      "Agricultural biomass, such as flax straw, plays a limited role in local and global bioenergy markets due to its generally lower quality compared to woody biomass. Among the ISO 17225 quality parameters for solid biofuels, mechanical durability is particularly critical, as it reduces dust generation during handling, transport, storage, and combustion. Achieving a durability of ≥97.5% with agricultural biomass is challenging, largely due to its lower bulk density, reduced lignin content, and higher ash levels.",
      "After five years of rigorous research and development in collaboration with university and industry partners- and with financial support from federal and provincial programs including Innovation Saskatchewan and the Mining Innovation Commercialization Accelerator (MICA)- Prairie Clean Enterprises (PCE) has successfully developed flax pellets from underutilized flax straw that meet ISO quality standards for solid biofuels.",
    ],
  },
  {
    title: "Prairie Clean Enterprises Establishes Flax Straw Facility in Weyburn",
    date: "2025-05-12",
    source: "CKRM",
    url: "https://www.620ckrm.com/2025/05/12/prairie-clean-enterprises-establishing-flax-straw-facility-in-weyburn/",
    topic: "facility",
    text: "“Saskatchewan-based agricultural clean-tech company Prairie Clean Enterprises (PCE) is setting up shop in Weyburn with the ‘world’s first’ flax straw processing facility.” CEO, Mark Cooper says “construction on the leased facility, located at 54 Queen Street, is expected to start this month with equipment arriving in August and production starting by September.” The facility is expected to bring over 30 full-time jobs to Weyburn and more than $3 million in annual wages into the local economy.",
  },
  {
    title: "Sask. Company Betting Big on Flax Straw with Plans for Weyburn Processing Plant",
    date: "2025-05-05",
    source: "CTV News Regina",
    url: "https://www.ctvnews.ca/regina/article/sask-company-betting-big-on-flax-straw-with-plans-for-weyburn-processing-plant/",
    topic: "facility",
    text: "“A Saskatchewan agritech company is planning to open what it calls a world-first facility capable of processing flax straw into industrial-grade fibre and premium pellets in Weyburn.” PCE is in its final stages of raising capital to get this facility up and running. The facility will produce a range of products from unutilized flax straw such as: Flax Fibre for pulp and specialty paper, flax shive pellets for a 100% and highly absorbent and ammonia-neutralizing cat litter, and pellets for animal bedding.",
  },
  {
    title: "Weyburn's New Flax Straw Facility to Create Jobs, Boost Local Economy",
    date: "2025-04-21",
    source: "SaskToday",
    url: "https://www.sasktoday.ca/southeast/weyburn-review/weyburns-new-flax-straw-facility-to-create-jobs-boost-local-economy-10551123",
    topic: "facility",
    text: "“A ground breaking flax straw processing facility is coming to Weyburn, bringing over 30 full-time jobs and injecting more that $3 million annually in wages into the local economy.” CEO, Mark Cooper discusses how the new facility in Weyburn, SK, is set to support local job creation and drive economic growth in the region.",
  },
  {
    title: "Prairie Clean Set to Open Up Shop in Weyburn",
    date: "2025-04-21",
    source: "Discover Weyburn",
    url: "https://discoverweyburn.com/articles/prairie-clean-set-to-open-up-shop-in-weyburn",
    topic: "facility",
    text: "On April 17, CEO, Mark Cooper took to the floor at Weyburn City Hall to share PCE’s exciting plans with the Mayor and City Council. Mark spoke about why Weyburn is the ideal home for the new facility. “Weyburn’s fantastic because it’s close to the available flax straw, it has industrial space available for us, great workforce, and the community is just very welcoming,” Cooper told Discover Weyburn following the presentation.",
  },
  {
    title: "Weyburn Selected as Site for New Agricultural Clean-Tech Facility",
    date: "2025-04-16",
    source: "Discover Weyburn",
    url: "https://discoverweyburn.com/articles/weyburn-selected-as-site-for-new-agricultural-clean-tech-facility",
    topic: "facility",
    text: "“A new clean-tech initiative will be formally introduced to Weyburn City Council Thursday morning, as Prairie Clean Enterprises outlines its plan to bring a first-of-its-kind processing facility to the city.” PCE is preparing to launch their first flax processing facility, located in Weyburn, SK. When open this September, the facility will be the only plant in the world processing flax straw into fibre and flax shive pellets for a variety of markets.",
  },
  {
    title: "Prairie Clean Energy Launches Crowdfunding Campaign",
    date: "2024-06-11",
    source: "PCE",
    kind: "announcement",
    topic: "funding",
    text: "Prairie Clean Energy (PCE) announced today the exciting launch of our crowdfunding campaign with FrontFundr, Canada’s leading online private markets investing platform. PCE is looking to raise the final $1.5M raise to buy 3 tonne/hour equipment for our existing facility in Regina, Saskatchewan, Canada.",
    body: [
      "Prairie Clean Energy (PCE) announced today the exciting launch of our crowdfunding campaign with FrontFundr, Canada’s leading online private markets investing platform. PCE is looking to raise the final $1.5M raise to buy 3 tonne/hour equipment for our existing facility in Regina, Saskatchewan, Canada. Visit PCE’s FrontFundr’s page to view PCE’s brand story.",
      "“With $1.2M already secured, we are opening up our fundraising to the general public to have an opportunity to share in PCE’s impactful bioenergy future…and to help resource the bioeconomy through the use of unutilized agricultural waste,” says Mark Cooper, PCE’s President & CEO.",
    ],
  },
  {
    title: "AgCanadaTV Special Feature: Turning straw into cash",
    date: "2024-07-26",
    source: "AgCanadaTV",
    url: "https://www.country-guide.ca/video/agcanadatv-special-feature-turning-straw-into-dollars/",
    kind: "video",
    topic: "farmers",
    text: "“Prairie Clean Energy is more than willing to take that flax straw off your hands for a range of uses.” Chief Strategy Officer Brita Lind attended the 2024 Ag in Motion event and shared insights on AgCanadaTV about Prairie Clean Energy’s impactful initiatives. Brita highlighted how PCE enables farmers to earn dual incomes from a single crop and PCE is expanding into worldwide markets with flax pellets.",
  },
  {
    title: "A Natural Solution to a Global Problem",
    date: "2024-07-18",
    source: "FrontFundr",
    url: "https://www.youtube.com/watch?v=dfy5-O6yp2Q",
    kind: "video",
    topic: "funding",
    text: "Prairie Clean Energy’s crowdfunding campaign on FrontFundr has achieved 80% of its target, bringing them one step closer to their goal. CEO, Mark Cooper recently sat down with FrontFundr expert Trieste to discuss the latest developments at PCE.",
  },
  {
    title: "Prairie Clean Energy Is Proud to Call Saskatchewan Home",
    date: "2024-04-01",
    source: "SaskBroker Magazine (Spring 2024)",
    url: "https://prairiecleanenterprises.com/wp-content/uploads/2024/06/SaskBroker_Spring_2024.pdf",
    topic: "facility",
    text: "There is simply no place quite like Saskatchewan when it comes to Prairie Clean Energy. Mark Cooper, CEO of PCE says, “as PCE grows into the multi-national large scale company that we can become, we will always remain headquartered here in Saskatchewan. That’s not a product of chance but of choice.” SaskBroker’s Magazine, “All in on Saskatchewan,” features an article written by Mark Cooper.",
  },
  {
    title: "Prairie Clean Energy is close to reaching crowdfunding goal to expand operations",
    date: "2024-06-17",
    source: "CKRM The Voice of Saskatchewan",
    url: "https://www.saskagtoday.com/2024/06/17/saskatchewan-based-company-close-to-reaching-crowdfunding-goal-to-expand-operations/",
    topic: "funding",
    text: "Saskatchewan-based company, Prairie Clean Energy was featured on the CKRM The Voice of Saskatchewan radio station. PCE is embarking on a crowdfunding campaign with a goal to raise $1.5 million, and so far has raised over $930-thousand through Front Fundr, an online private market investing platform. CEO, Mark Cooper explains that through Front Fundr, the average person can join our exciting journey by making a minimum investment of just five hundred dollars.",
  },
  {
    title: "Prairie Clean Energy Envisions Power From Flax Pellets",
    date: "2024-06-14",
    source: "Western Producer",
    url: "https://www.producer.com/news/company-envisions-power-from-flax-pellets/",
    topic: "products",
    text: "Saskatchewan-based company, Prairie Clean Energy is featured in the Western Producer, the largest agricultural magazine in Western Canada. CEO Mark Cooper and Founder Trevor Thomas share the story of the founding of Prairie Clean Energy and elaborate on PCE’s strategy for achieving success. “PCE has big plans to convert flax straw into pellets. The pellets will be processed at a plant in Regina and sold to industrial, commercial and residential customers for heat and power generation.”",
  },
  {
    title: "Fueled By Flax Straw",
    date: "2024-03-04",
    source: "Biomass Magazine",
    url: "https://biomassmagazine.com/articles/fueled-by-flax-straw",
    topic: "research",
    text: "Prairie Clean Energy has transitioned from proof of concept to minimum viable product to being named by the Vienna Institute as one of the top 10 clean energy companies to watch in the world in 2023—all in rapid succession. With financial support from Innovation Saskatchewan under a Saskatchewan Advantage Innovation Fund project and a $1.1 million grant from the Mining Innovation Commercialization Accelerator, the company and its academic partners successfully developed a proprietary flax straw pellet production process, which is patent pending, and they are now working on a second patent application.",
  },
  {
    title: "Sask. Polytech partners with Prairie Clean Energy to advance bioheating industry",
    date: "2024-01-20",
    source: "600 CJWW",
    url: "https://www.cjwwradio.com/2024/01/20/sask-polytech-partners-with-prairie-clean-energy-to-advance-bioheating-industry/",
    topic: "research",
    text: "In the future, flax pellets might be used as the main form of heating in the potash industry thanks to a collaboration between Saskatchewan Polytechnic and Regina-based company, Prairie Clean Energy. Dr. Robin Smith with Sask. Polytechnic says the goal of the collaboration is to reduce greenhouse gas emissions by replacing the use of natural gas with bioheat, generated by burning locally acquired flax pellets.",
  },
  {
    title: "Ag Waste Can Provide Bioheat",
    date: "2024-01-19",
    source: "Penticton Herald",
    url: "https://www.pentictonherald.ca/spare_news/article_6a1bfdc5-06cf-5f6a-a3a8-6b236aa53716.html",
    topic: "research",
    text: "Earlier this year Saskatchewan-based business, Prairie Clean Energy, received a $1.1 million grant from the Mining Innovation Commercialization Accelerator (MICA) Network for their innovative greenhouse gas (GHG) emissions reduction project. The project aims to revolutionize the potash industry by utilizing locally produced agricultural waste in the form of flax straw to generate low carbon bioheat, potentially reducing GHG emissions by up to 80 percent.",
  },
  {
    title: "Saskatchewan Polytechnic joins Prairie Clean Energy to transform ag waste for industry use",
    date: "2024-01-12",
    source: "DiscoverMooseJaw.com",
    url: "https://www.discovermoosejaw.com/articles/saskatchewan-polytechnic-joins-prairie-clean-energy-to-transform-ag-waste-for-industry-use",
    topic: "research",
    text: "Prairie Clean Energy has teamed up with Saskatchewan Polytechnic in a project to turn the province’s agricultural waste into low carbon bioheat. The Mining Innovation Commercialization Accelerator (MICA) Network gave Prairie Clean Energy a grant for $1.1 million for a research project seeking to create heat from flax straw that would otherwise be a waste product. Prairie Clean Energy is working together on the project with Saskatchewan Polytechnic’s applied research centre, known as Sustainability-Led Integrated Centres of Excellence (SLICE).",
  },
  {
    title: "Sask Polytech will develop 'living lab' to test flax straw bioheat for potash industry",
    date: "2024-01-10",
    source: "MooseJawToday.com",
    url: "https://www.moosejawtoday.com/local-news/sask-polytech-will-develop-living-lab-to-test-flax-straw-bioheat-for-potash-industry-8078162",
    topic: "research",
    text: "In collaboration with Saskatchewan-based business Prairie Clean Energy, Saskatchewan Polytech will develop a “living lab” pilot operation at an agricultural site near Moose Jaw to serve as a testing ground for the viability of using prairie biomass to generate industrial heat. The project will draw on a $1.1 million grant that Prairie Clean Energy received from the Mining Innovation Commercialization Accelerator (MICA) Network for its greenhouse gas (GHG) emissions reduction project.",
  },
  {
    title: "Saskatchewan-based Prairie Clean Energy wants farmers’ flax straw",
    date: "2023-10-17",
    source: "620 CKRM",
    url: "https://www.620ckrm.com/2023/10/17/saskatchewan-based-prairie-clean-energy-wants-producers-flax-straw/",
    topic: "farmers",
    text: "A Saskatchewan-based company that focuses on providing sustainable and clean prairie-based biomass fuel, wants to buy flax straw from farmers. CEO of Prairie Clean Energy Mark Cooper says they’re buying between 6-thousand to 54-thousand tons of straw at a time, within a 100-kilometre radius around Regina and a 75-kilometre radius around Gilbert Plains, Manitoba. It’s part of their plan to scale up production of flax pellets.",
  },
  {
    title: "PCE begins buying flax straw from local farmers",
    date: "2023-08-10",
    source: "SaskToday.ca",
    url: "https://www.sasktoday.ca/agriculture/pce-begins-buying-flax-straw-from-local-producers-7386632",
    topic: "farmers",
    text: "Saskatchewan-based business, Prairie Clean Energy (PCE), has announced they will start buying flax straw from Canadian farmers on the prairies this fall as the company starts its first foray into scaling up production of its flax pellets. PCE will be purchasing flax straw within a 75-kilometre radius around both Regina and Gilbert Plains, Man., where the company has leased time at a facility for the initial production of the company’s proprietary flax pellets.",
  },
  {
    title: "Prairie Clean Energy to begin purchasing flax straw this fall",
    date: "2023-08-08",
    source: "Canadian Biomass",
    url: "https://www.canadianbiomassmagazine.ca/prairie-clean-energy-to-begin-purchasing-flax-straw-this-fall/",
    topic: "farmers",
    text: "Saskatchewan-based business, Prairie Clean Energy (PCE), is excited to announce they will start buying flax straw from Canadian farmers on the prairies this fall as the company starts its first foray into scaling up production of its flax pellets. PCE will be buying anywhere from 6,000 to 54,000 tonnes of flax straw, the range being wide as the company works on production projections and growth plans into 2024.",
  },
  {
    title: "Prairie Clean Energy Dives into Flax Straw Market",
    date: "2023-08-09",
    source: "Farms.com",
    url: "https://www.farms.com/ag-industry-news/prairie-clean-energy-dives-into-flax-straw-market-148.aspx",
    topic: "farmers",
    text: "Prairie Clean Energy (PCE) has a vision that turning underused flax straw from the Canadian prairies into sustainable pellets for diverse uses. This company from Saskatchewan said they will start buying this straw soon to begin making their special pellets. The company is looking for flax straw in two main areas; Regina and Gilbert Plains, MB, within a 75-km radius of each location.",
  },
  {
    title: "Saskatchewan company to buy flax straw in the Gilbert Plains area",
    date: "2023-08-28",
    source: "Manitoba Co-operator",
    url: "https://www.manitobacooperator.ca/?p=205459",
    topic: "farmers",
    text: "Flax straw from Manitoba becomes premium horse bedding pellets.",
  },
  {
    title: "Prairie Clean Energy wins $1.1M for flax straw pellet project",
    date: "2023-06-27",
    source: "Biomass Magazine",
    url: "https://biomassmagazine.com/articles/20160/prairie-clean-energy-wins-1-1m-for-flax-straw-pellet-project",
    topic: "funding",
    text: "Saskatchewan-based business, Prairie Clean Energy (PCE), is thrilled to announce they have been awarded a $1.1 million grant from the Mining Innovation Commercialization Accelerator (MICA) Network for their GHG emissions reduction project utilizing prairie biomass. Of the 24 projects receiving MICA funding, PCE was the only Saskatchewan recipient.",
  },
  {
    title: "Harrison leading trade mission to Japan, South Korea",
    date: "2023-02-02",
    source: "980 CJME",
    url: "https://www.cjme.com/2023/02/02/harrison-leading-trade-mission-to-japan-south-korea/",
    topic: "products",
    text: "Saskatchewan’s trade and export development minister is to lead a delegation to Japan and South Korea this week to explore new trade opportunities. Mark Cooper, CEO of Prairie Clean Energy, will also be joining the delegation. He said the mission is an opportunity to further Saskatchewan’s role as a leader in sustainable bioenergy.",
  },
  {
    title: "Regina entrepreneur selling Sask. biomass energy in Europe",
    date: "2022-05-03",
    source: "Regina Leader-Post",
    url: "https://leaderpost.com/news/saskatchewan/regina-entrepreneur-selling-sask-biomass-energy-potential-in-europe",
    topic: "products",
    text: "Prairie Clean Energy CEO and President Mark Cooper says Saskatchewan could fill a void because the war in Ukraine has halted biomass exports from Russia. With the war in Ukraine, he said, companies across Europe are eagerly looking for the product because they can no longer source it from Russia.",
  },
  {
    title: "Saskatchewan Bioenergy Company Hosts Japanese Firm",
    date: "2022-01-25",
    source: "West Central Online",
    url: "https://westcentralonline.com/articles/saskatchewan-bioenergy-company-hosts-japanese-firm",
    topic: "products",
    text: "Saskatchewan-based bioenergy company, Prairie Clean Energy (PCE), welcomed representatives from Japan’s largest renewable energy developer – RENOVA Inc. – to Regina last week for important talks. The meetings with RENOVA Inc. highlight the global interest in PCE’s momentum in the bioenergy space, and demonstrate the high-level of demand for a fully renewable and sustainable biomass fuel source like flax straw.",
  },
  {
    title: "Prairie Clean Energy Awarded Grant from Government of Saskatchewan",
    date: "2021-12-07",
    source: "Innovation Saskatchewan",
    url: "https://innovationsask.ca/news/innovation-saskatchewan-invests-million-in-tech-sector",
    topic: "funding",
    text: "Prairie Clean Energy is excited to announce we have been awarded a grant through the Saskatchewan Advantage Innovation Fund (SAIF) and Agtech Growth Fund (AGF). Through the SAIF and AGF programs, the Government of Saskatchewan is investing in six innovative Saskatchewan companies from the province’s core economic sectors.",
  },
  {
    title: "Fuel from Flax",
    date: "2021-01-01",
    source: "Canada Biomass Magazine (Winter 2021)",
    url: "https://magazine.canadianbiomassmagazine.ca/publication/?m=2049&i=693671&p=16&pp=1",
    topic: "research",
    text: "An inside look at the efforts of a Saskatchewan-based start-up to produce biofuel from flax straw.",
  },
  {
    title: "Company develops biofuel market for flax straw",
    date: "2020-08-20",
    source: "Western Farmer",
    url: "https://www.producer.com/news/company-develops-biofuel-market-for-flax-straw/",
    topic: "products",
    text: "There are more than 4,000 biomass power plants in the world and they can’t find the fuel they need to meet demand, says PrairieClean Energy. The company believes it has a prairie-made solution.",
  },
  {
    title: "Flax straw from Saskatchewan being bought for biomass fuel",
    date: "2020-07-30",
    source: "Weyburn Review",
    url: "https://www.weyburnreview.com/news/ag-oil/flax-straw-from-saskatchewan-being-bought-for-biomass-fuel-1.24178282",
    topic: "farmers",
    text: "A Saskatchewan company, Prairie Clean Energy of Regina, has found a way to take the thousands of tonnes of Saskatchewan flax straw that gets burned or trashed on the prairies every year and turn it into something that can provide income to farmers and sustainable growth for rural Saskatchewan.",
  },
  {
    title: "Prairie Clean Energy Is Looking To Buy Flax Straw",
    date: "2020-07-26",
    source: "Discover Weyburn",
    url: "https://www.discoverweyburn.com/articles/prairie-clean-energy-is-looking-to-buy-flax-straw",
    topic: "farmers",
    slug: "prairie-clean-energy-is-looking-to-buy-flax-straw-discover-weyburn",
    text: "There may be a solution for what to do with flax straw other than burning it that could make prairie farmers money. Prairie Clean Energy, a Saskatchewan based company, is processing and selling flax straw for biomass fuel to Canadian and global customers.",
  },
];

export const news: New<News>[] = newsItems.map((n) => ({
  title: n.title,
  ...(n.slug ? { slug: n.slug } : {}),
  kind: n.kind ?? "article",
  source: n.source,
  ...(n.url ? { externalUrl: n.url } : {}),
  excerpt: ex(n.text),
  ...(n.body ? { body: richText(...n.body) } : {}),
  publishedOn: d(n.date),
  topic: n.topic,
  ...(n.featured ? { featured: true } : {}),
}));

export const team: New<Team>[] = [
  {
    name: "Mark Cooper",
    role: "MBA, PMP, President & CEO",
    bio: "Mark oversees all aspects of PCE’s strategic direction and operations. An MBA graduate, Project Management Professional, and certified mediator/negotiator, he has spent 20 years working in government relations and currently serves on several non-profit boards in the local community.",
    order: 1,
  },
  {
    name: "Trevor Thomas",
    role: "Founder",
    bio: "The founder of PCE, Trevor builds relationships with customers and farmers in order to secure supply contracts and industrial sales. He has an agricultural background and serves as Chair of PCE’s Board of Directors.",
    order: 2,
  },
  {
    name: "Brita Lind",
    role: "Chief Strategy Officer",
    bio: "Brita Lind is responsible for PCE’s strategy, branding, marketing, and communications. A graduate of Harvard University, Brita brings more than 20 years of marcom experience having worked on such brands as Farm Credit Canada, Bose Corporation, SaskTel, and more.",
    order: 3,
  },
  {
    name: "Mahmood Ebadian",
    role: "Ph.D., Chief Product and Supply Chain Development Officer",
    bio: "Mahmood is a supply chain management and lean manufacturing expert. He leads PCE’s research and provides expertise in several areas, including feedstock supply and logistics. Mahmood has provided consulting services to the biomass and bioenergy industry in North and South America for over 12 years.",
    order: 4,
  },
  {
    name: "Hank Froese",
    role: "VP, Farmer Relations and Processing",
    bio: "Hank worked for SWM International for over 30 years, managing the Canadian operations for the last 10 years. He is a flax straw operation and aggregation expert and works in the areas of farmer relations, farmer contracts, supply chains, manufacturing, and shipping.",
    order: 5,
  },
  {
    name: "Dr. Matthew Goodwin",
    role: "Director, UK & Europe",
    bio: "Matt, who is also a Director of the European Pellet Council, specializes in the quality management, specification, and supply of biomass and waste-derived fuels both in the premium and industrial markets. He brings critical first-hand expertise on the impact feedstock quality has on system performance both for heating and power generation.",
    order: 6,
  },
];

export const partners: New<Partner>[] = [
  { name: "SaskFlax", url: "https://www.saskflax.com/", category: "industry", order: 1 },
  { name: "University of Saskatchewan", url: "https://www.usask.ca/", category: "academic", order: 4 },
  { name: "University of Regina", url: "https://www.uregina.ca/", category: "academic", order: 3 },
  { name: "University of British Columbia", url: "https://www.ubc.ca/", category: "academic", order: 2 },
  { name: "Saskatchewan Polytechnic", url: "https://saskpolytech.ca/", category: "academic", order: 8 },
  { name: "Innovation Saskatchewan", url: "https://innovationsask.ca/", category: "government", order: 7 },
  { name: "STEP", url: "https://sasktrade.com/", category: "government", order: 5 },
  { name: "Government of Saskatchewan", url: "https://www.saskatchewan.ca/", category: "government", order: 6 },
];

export const jobs: New<Job>[] = [
  {
    title: "General Labourer",
    slug: "general-labourer-weyburn",
    location: "Weyburn, SK",
    employmentType: "full_time",
    shift: "Day shift",
    summary:
      "As a General Labourer, you’ll serve as the day-shift backbone of our facility operations. This role keeps our shift operators focused on production by handling the steady stream of logistical, organizational, and support needs that arise throughout the workday.",
    about: richText(
      "This is not an operator position — no technical experience is required. What we need is someone dependable, willing to stay busy, and able to work with minimal supervision.",
    ),
    responsibilities: [
      { title: "Yard work", text: "Maintain the yard year-round, including snow removal, mowing grass, and clearing debris. Keep the yard cared for and presentable." },
      {
        title: "Night shift prep",
        text: "Ensure all consumables, tools, fuel, and other supplies are prepped and ready before night shift begins. Take the time to confirm night shift has everything they will need to keep production running through the shift.",
      },
      {
        title: "Parts & supply runs",
        text: "Pick up and deliver parts, materials, and supplies as needed by operators and maintenance staff throughout the shift. Coordinate with vendors and internal contacts to confirm availability before making trips.",
      },
      {
        title: "Tool organization & inventory",
        text: "Maintain the tool room and shared tool areas, ensuring tools are clean, accounted for, properly stored, and returned to their designated locations. Flag damaged or missing items promptly.",
      },
      {
        title: "General facility support",
        text: "Assist operators and technicians with miscellaneous tasks as directed — moving materials, staging work areas, light cleaning, and any other hands-on support that keeps the floor running smoothly.",
      },
      {
        title: "Errands & off-site tasks",
        text: "Complete local off-site errands including hardware store runs, supply pickups, and courier tasks as requested. Must be comfortable driving a company vehicle and keeping a basic trip log.",
      },
      {
        title: "Miscellaneous duties",
        text: "Tackle the small but important tasks that fall through the cracks during shift work — restocking consumables, organizing storage areas, relaying messages between departments, and other as-needed duties.",
      },
    ],
    requirements: [
      { text: "Valid driver’s licence" },
      { text: "Self-starter attitude with a strong work ethic" },
      { text: "Comfortable working in a shop or industrial setting" },
      { text: "Strong communication skills" },
      { text: "Able to work independently with minimal supervision" },
      { text: "Reliable and punctual" },
    ],
    open: true,
    postedOn: d("2026-10-01"),
  },
];
