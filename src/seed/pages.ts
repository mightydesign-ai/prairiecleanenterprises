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
      showImageArea: true,
    },
    {
      blockType: "productList",
      eyebrow: "Our products",
      heading: "Discover our signature innovations",
    },
    {
      blockType: "imageText",
      tone: "tinted",
      eyebrow: "Flax fibre abundancy",
      heading: "Flax is an abundant, secure crop in Canada",
      imagePlaceholder: true,
      imageSide: "right",
      content: richText(
        "Flax is an abundant, secure crop in Canada. Over 750,000 tonnes of flax straw are produced annually on the Canadian prairies. Of all the flax grown worldwide, 40% is produced in Canada. Most of which is grown in the same province as PCE’s head office, Saskatchewan. Unlike other areas around the world, Canadians grow flax for its highly nutritious seeds. The seeds are harvested, but the flax straw is almost always burned in fields as it has no nutritional value and is too fibrous to be tilled back into the soil.",
      ),
    },
    {
      blockType: "imageText",
      eyebrow: "Efficient, clean fibre decortication",
      imagePlaceholder: true,
      imageSide: "left",
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
      columns: "2",
      showBorder: false,
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
    {
      blockType: "imageText",
      eyebrow: "The business model",
      heading: "The business model at a glance",
      imagePlaceholder: true,
      imageSide: "below",
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
        eyebrow: "About",
        heading: "The PCE story",
        content: richText(
          "PCE (Prairie Clean Energy) was launched in 2020 out of the pursuit for an environmentally sustainable solution to agricultural waste. After years of seeing acres of flax straw being burned near his home in rural Saskatchewan, founder Trevor Thomas knew he had discovered a solution to the global wood shortfall – a solution that also provided farmers with an economical and environmentally-conscious way to use flax straw waste.",
          "After researching the potential of flax straw as a fuel source, Trevor established PCE to bridge the gap between flax farmers and those seeking clean, reliable biomass fuel and other high-value products. Since then, PCE continues to develop the aggregation and processing technologies that build into partnerships with farmers and organizations across Canada and the world to deliver high-quality flax straw products to customers across the world.",
        ),
      },
      {
        blockType: "cards",
        tone: "tinted",
        items: [
          {
            title: "Our purpose",
            text: "At PCE we invest in our communities and power the world as the global leader in providing sustainable use of unutilized agricultural and organic waste.",
          },
          {
            title: "Our vision",
            text: "PCE’s vision is to be the world-class aggregator and processor of Prairies-based agricultural and organic waste.",
          },
          {
            title: "Our mission",
            text: "PCE mission is to Create and Lead Sustainable Agricultural Residue Aggregation and Processing on the Canadian Prairies. As a first-mover in this space, we are creating a whole new market. We can and will lead the industry.",
          },
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
        blockType: "imageText",
        eyebrow: "Our location",
        heading: "Saskatchewan: A global leader in agriculture production",
        imagePlaceholder: true,
        imageSide: "right",
        content: richText(
          "Saskatchewan is one of Canada’s three prairie provinces, bordered by Alberta to the west and Manitoba to the east. Known as the “breadbasket of Canada,” the province is characterized by its thriving agricultural industry in the south and its boreal forest in the north. We are larger than France with a population about half that of Paris.",
        ),
      },
      {
        blockType: "cards",
        tone: "dark",
        eyebrow: "Why Saskatchewan",
        heading: "Almost a third of the world's flax grows here",
        items: [
          {
            title: "Reliable infrastructure",
            text: "We have ready access to two national rail lines, a transcontinental highway, and a network of other major highways. Canada is a stable, democratic country with reliable and fair regulations.",
          },
          {
            title: "Abundant resources",
            text: "Saskatchewan produces more than 40% of Canada’s total agricultural output. You can see crops like flax, barley, canola, canary seed, hemp, wheat and many more growing in its vast fields. Saskatchewan farmers account for almost a third of all global flax production. Flax straw is 100% renewable and our PCE flax pellets are made from flax straw that has no other purpose.",
          },
          {
            title: "Established relationships",
            text: "Our team is the only flax buyer in Saskatchewan registered with SaskFlax, the Saskatchewan Flax Development Commission, and we have good working relationships with farmers across the province.",
          },
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
        blockType: "richText",
        eyebrow: "Sustainability benefits",
        heading: "Stakeholder Benefits: Flax Straw Fibre & Flax Shive Pellets",
        content: richText(
          "Our PCE approach of cost-efficiently aggregating and processing unutilized agricultural residue will help domestic and global customers in their sustainability efforts while maintaining high quality and outputs.",
          "Our production pathway will create benefits for stakeholders across the value chain including farmers, fibre customers, fuel pellet customers, and retail customers. From companies utilizing flax fibre and industries that seek transition from fossil fuels to sustainable, renewable and low-carbon energy sources, we have the approach and philosophy needed.",
          "Our proposed flax straw processing facility Saskatchewan is projected to provide the following sustainability benefits:",
        ),
      },
      {
        blockType: "richText",
        tone: "tinted",
        heading: "Climate Change and Environment Benefits",
        content: richText(
          "The use of underutilized flax straw to supply flax fibre for pulp and speciality paper companies, biocomposites as well as pellets for retail applications, fuel pellets and more will reduce both air pollution and the GHG emissions, has no impact on the local water supply, and does not create any waste that needs to be landfilled:",
          "Currently, the majority of flax growers burn flax straw at the field after harvest season. Burning every tonne of flax straw generates about 80kg CO2e of GHG emissions. Burning 50 tonnes of flax straw in the field is equivalent to the annual GHG emissions generated by a typical passenger vehicle (about 4 tonnes/year). So, by way of example, using about 85,000 tonnes of flax straw to produce 75,000 tonnes of fibre and pellets is equivalent to removing 1,700 passenger vehicles annually from the road network.",
        ),
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
        blockType: "richText",
        heading: "Socio-economic benefits",
        content: richText(
          "The aggregation and processing of unutilized agricultural residue production requires several logistics operations, including harvesting, collection, storage, processing, and transportation. All these operations have the potential to add skilled positions to the economy.",
          {
            list: [
              "The project will create around millions of dollars annually for baling, bale handling, storage, and transportation businesses.",
              "New jobs will be created including jobs in flax straw logistics and jobs at the flax straw processing facility.",
              "Creation of business opportunities for Saskatchewan farmers. Currently, flax straw is viewed as an agricultural waste with no economic value. This project will create a market for flax straw, generating new additional annual income streams for local flax growers.",
              "Training and employment opportunities for highly skilled personnels: the processing of flax straw will create income for the operators working at the flax straw processing facility in Regina.",
              "The use of flax straw pellets for domestic bioheat generation would result in deep decarbonization of industries that use large amounts of fossil fuels for heat and power generation (up to 90%).",
              "No water is used in flax straw pellet production and there is no potential water contamination in the flax straw-to-bioheat value chain.",
              "No chemicals are used in flax straw pellet production and no by-products are produced that need disposal/landfill in flax straw pellet production.",
            ],
          },
        ),
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
        text: "Contact us to learn more about the environmental benefits of our flax straw pellets.",
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
        blockType: "richText",
        eyebrow: "Flax straw purchase",
        heading: "Please read through this carefully",
        content: richText(
          "PCE has been purchasing flax straw from farmers every year since 2022, with each year increasingly more flax straw being purchased than the last. If you’re interested in being part of our next round of flax straw purchasing, please read through this page and then fill out the form below. Thank you.",
          { heading: "Location & transportation" },
          {
            list: [
              "We typically are purchasing in the southeastern Saskatchewan area but are open to talking with flax farmers from all areas.",
              "Bales are stored on the farmer’s property.",
              "Transportation to the processing site can be done by the farmer or PCE will make arrangements.",
            ],
          },
        ),
      },
      {
        blockType: "cards",
        tone: "tinted",
        heading: "What we buy",
        intro: "Our priority is southeastern Saskatchewan, but we want to hear from growers anywhere who can bale and haul to Weyburn.",
        items: [
          { tag: "Bales", title: "At least 900 lbs", text: "Bales must be at least 900 lbs, with 15% moisture content or less." },
          { tag: "Bales", title: "Rock free", text: "Bales must be rock free. Minimal weed content." },
          { tag: "Bales", title: "Round or large-square" },
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
            question: "How do I get a contract to sell PCE my straw?",
            answer:
              "Please fill out the form below to start the process. If you’re in the purchasing area you will hear from us and we will email you a contract.",
          },
          {
            question: "What if I am not in the purchasing area?",
            answer:
              "We are planning to ramp up production and expand our purchasing area throughout the year. While our immediate priority is the southeastern Saskatchewan region, we are interested in connecting with producers who can bale and transport straw to that area at a cost within our purchase budget. Please fill out the form below so we have your information as our requirements grow.",
          },
          {
            question: "I didn’t grow flax this year but am considering it for next year.",
            answer:
              "We recommend signing a Right of First Refusal (ROFR) agreement with PCE. This is a flexible five-year agreement that states if you grow flax, PCE has the first right to negotiate a purchase of your straw. Having an ROFR on file ensures you are a part of our established network as we expand our operations and production capacity. You are not obligated to grow flax every year or sell exclusively to us if terms aren’t met. Please fill out the form below with “ROFR” in the message, and we will send you the details.",
          },
          {
            question: "Who arranges and pays for trucking?",
            answer: "You can deliver yourself, or we arrange it. Transport is paid in addition to the bale price, based on distance.",
          },
          {
            question: "I’m interested in investing in PCE, how do I get more information?",
            answer:
              "If you’re an accredited investor or know someone who is, please visit our investor page at /investors and we can provide you with information to learn more or to share with others.",
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
        blockType: "richText",
        eyebrow: "Investors",
        heading: "Investment in Prairie Clean Enterprises",
        content: richText(
          "Thank you for your interest in investing in Prairie Clean Enterprises (PCE). If you are an accredited investor, please contact us and we will email you an investor package. For more information about investing in PCE’s current round, please scroll down further.",
        ),
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
        blockType: "imageText",
        eyebrow: "In production & on shelves",
        heading: "Prairie Clean Enterprises is in Co-op stores across Western Canada and has a Walmart Canada Golden Ticket",
        imagePlaceholder: true,
        imageSide: "right",
        content: richText(
          "PCE is a 100% Canadian company producing 100% Canadian products. PCE’s business model is buying flax straw from prairie farmers and processing the straw into flax fibre and flax shive pellets for a variety of value-added, high-margin products for the multi-billion dollar bioeconomy. Products like Prairie Clean Litter and Prairie Clean Flax Bedding and Prairie Clean Biofuel. Our mission is to stop the burning of un-utilized flax straw.",
          "We have opened the only flax straw multi-processing facility for fibre and shive in the world in Weyburn, Saskatchewan, Canada. We have an exclusive deal with Federated Co-operatives Limited (FCL) to be on the shelves of Co-op stores across Western Canada AND we were one of the select few Canadian companies to receive a Golden Ticket from Walmart Canada to be online and in-store.",
          "We have all the straw we need sourced, we’ve been in production since February, customer orders are rolling in, and we are shipping product to the US, Canada, and Europe.",
          "Now is the time to make the decision to invest in PCE.",
          "PCE’s 30,000 sq. ft. facility is in operation in Weyburn, Saskatchewan, Canada, producing and shipping product.",
        ),
      },
      {
        blockType: "cards",
        eyebrow: "Current round · accredited investors only",
        heading: "Two ways to invest",
        intro: "Announcing our fundraising round to scale 100% Canadian company and products national. Here are the details:",
        items: [
          { title: "Equity: $7 CAD per share", text: "Minimum investment $50,000 CAD." },
          { title: "Debt: 10% annual interest", text: "Compounded monthly. Minimum investment $100,000 CAD." },
          { title: "Registered accounts", text: "Invest through a TFSA, RRSP or LIRA; ask us for details." },
          { title: "Tax credit", text: "Saskatchewan investments may qualify for the 45% SMEITC provincial credit, which is capped and first-come." },
          { title: "Limited slots", text: "Secure your allocation before the round closes." },
        ],
      },
      {
        blockType: "richText",
        tone: "tinted",
        eyebrow: "Why act now",
        heading: "There are several reasons to act now on this investment",
        content: richText(
          {
            list: [
              "Facility is operational, straw is secured, customer orders are rolling in and being fulfilled",
              "Capital will enable enhanced growth and scale up nationally and internationally",
              "Equity and debt slots are limited",
              "Saskatchewan investments may be eligible for a 45% SMEITC provincial tax credit (Small and Medium Enterprise Investment Tax Credit. There is a cap to the SMEITC tax credit; it's a first-in program for accredited investors. When it's gone, it's gone. Talk with use now about the details.",
            ],
          },
          "Let’s build something enduring – together.",
        ),
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
      {
        blockType: "cards",
        eyebrow: "Get in touch",
        heading: "Weyburn Production Facility",
        items: [
          { tag: "Address", title: "54 Queen Street", text: "North Weyburn, SK S0C 1X0, Canada" },
          { tag: "Phone", title: "1 (844) 978-3529", text: "Local: 1 (306) 910-3529" },
          { tag: "Email", title: "info@prairiecleanenterprises.com" },
        ],
      },
      { blockType: "form", form: "contact", heading: "Send us a message" },
    ],
  },
  {
    title: "Privacy policy",
    slug: "privacy",
    layout: [
      {
        blockType: "richText",
        eyebrow: "Last update of this privacy policy: April 25, 2021",
        heading: "Privacy policy",
        content: richText(
          "BEFORE USING OUR SITE, PLEASE READ THIS PRIVACY POLICY CAREFULLY.",
          "This Privacy Policy is applicable to Prairie Clean Energy (“Company”) and sets out our policy on the gathering and use of information on this site and our other sites (collectively “Sites”). The Company is committed to providing safe websites for visitors of all ages and has implemented this Privacy Policy to demonstrate our firm commitment to your privacy. The Company complies with Canadian Federal and Provincial privacy laws and regulations including the Personal Information and Electronic Documents Act.",
          "There may be links from our Sites to other websites; note that this Privacy Policy applies only to our Sites and not to websites of other companies or organizations to which our Sites may be linked. You must check on any linked sites for the privacy policy that applies to that site and/or make any necessary inquiries in respect of that privacy policy with the operator of the linked site. These links to third-party websites are provided as a convenience and are for informational purposes only. The Company does not endorse and is not responsible for, these linked websites.",
          "Although you are not required to register to access our Sites, you may be asked to provide us with personal information when you visit certain sections of our Sites. Your use of our Sites signifies your acknowledgement and consent to our Privacy Policy. If you do not agree to this Privacy Policy, please do not continue to use our Sites. Your continued use of the Sites signifies your acceptance of these terms and any changes in effect at the time of use.",
          { heading: "COLLECTION OF PERSONAL INFORMATION" },
          "Personal Information is information about you that identifies you as an individual, for example, your name, address, e-mail address, or telephone number.",
          "We collect information that you voluntarily provide to us through responses to surveys, search functions, questionnaires, feedback, Tell Your Story forms and the like. On some of our Sites, we offer health assessment tools that ask you to provide self-assessment information. We may also ask you to provide additional information such as your e-mail address if you want to obtain additional services, information, participate in a contest or to resolve complaints or concerns.",
          { heading: "HOW DOES COMPANY USE INFORMATION GATHERED ABOUT ONLINE VISITORS?" },
          "Before forwarding us any personal information, please be advised that any information gathered on our Sites may be used in the aggregate for research and development relating to our Sites and/or for future site development and, if you ask us to, to send you promotional materials. In particular, we may use information gathered about you for the following purposes: to monitor interest in our range of products and to assist us to tailor the content of our Sites to your needs by collecting information about your preferences through tracking of patterns page views on our Sites; to create a profile relating to you in order to show you the content that might be of interest to you and to display the content according to your preferences; and, in circumstances where you have indicated that you wish to receive additional information, to send you information about us and promotional material about our products together with details of any offers we may have available from time to time.",
          { heading: "PROMOTIONAL AND INFORMATIONAL OFFERS" },
          "With the permission of an online visitor, information submitted at the time of registration or submission may be used for marketing and promotional purposes by the Company provided notice of this fact is made available online. If a visitor objects to such use for any reason, he/she may prevent that use, either by e-mail request or by modifying the registration information provided. The Company uses reasonable efforts to maintain visitors’ information in a secure environment. If you have submitted personal information and want to change it or opt-out, please contact us as described below.",
          { heading: "DISCLOSURE OF INFORMATION" },
          "The Company will not disclose personal information that you provide on its Sites to any third parties other than to a Company agent except: i) in accordance with the terms of this Privacy Policy, or ii) to comply with legal requirements such as a law, regulation, warrant, subpoena or court order, and/or iii) if you are reporting an adverse event/side effect, in which case the Company may be required to disclose such information to bodies such as, but not limited to, Canadian and/or international regulatory authorities. Please note that any of these disclosures may involve the storage or processing of personal information outside of Canada and may therefore be subject to different privacy laws than those applicable in Canada, including laws that require the disclosure of personal information to governmental authorities under circumstances that are different than those that apply in Canada.",
          { heading: "COOKIES" },
          "The Company, in common with many website operators, may use standard technology called “cookies” on its Sites. Cookies are small data files that are downloaded onto your computer when you visit a particular website. You can disable cookies by turning them off in your browser; however, some areas of the Sites may not function properly if you do so.",
          { heading: "PROTECTION OF CHILDREN ONLINE" },
          "The Company considers the protection of children’s privacy, especially online, to be of the utmost importance. We do not knowingly collect or solicit personal information from children nor do we allow them to become registered users of, or to request information through, our Sites or help-seeking information lines.",
          { heading: "ADDITIONAL TERMS FOR CERTAIN WEBSITES" },
          "The following additional information applies to our Sites that require registration. Generally, you are not required to provide personal information as a condition of using our Sites, except as may be necessary to provide you with a product or service that you have requested. However, some of our Sites are restricted to certain individuals such as health care professionals or our prescription drug patients and we may require these individuals to register upon entry by providing us with certain information.",
          { heading: "PROTECTION OF INFORMATION: Our Commitment to Security" },
          "We have put in place physical, electronic, and managerial procedures to safeguard and help prevent unauthorized access, maintain data security, and correctly use the information we collect online. The Company applies security safeguards appropriate to the sensitivity of the information, such as retaining information in secure facilities and making personal information accessible only to authorized employees on a need-to-know basis.",
          { heading: "STORAGE OF INFORMATION" },
          "Personal information you share with us is stored on our database servers or hosted by third parties who have entered into agreements with us that require them to observe our Privacy Policy.",
          { heading: "POLICY CHANGE" },
          "If we alter our Privacy Policy, any changes will be posted on this page of our Site so that you are always informed of the information we collect about you, how we use it and the circumstances under which we may disclose it.",
          { heading: "ACCEPTANCE OF OUR PRIVACY POLICY" },
          "By using this Site or any other The Company Site or interactive banner ads, you signify your acceptance of our Privacy Policy, and you adhere to the terms and conditions posted on the Site. By submitting your information, you agree that it will be governed by our Privacy Policy.",
        ),
      },
    ],
  },
];
