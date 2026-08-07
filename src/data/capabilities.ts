export interface Capability {
  name: string;
  description: string;
  projects: string; // pre-formatted HTML-safe string with <b> tags for project names
  tags: string[];
}

export interface Pillar {
  label: string;
  capabilities: Capability[];
}

export const pillars: Pillar[] = [
  {
    label: 'Growth & Marketing',
    capabilities: [
      {
        name: 'Performance Marketing & CRM',
        description: 'Paid campaigns and CRM sequences measured against click-through and qualified leads, not impressions.',
        projects: '<b>Dream Box</b> &middot; <b>KKBC</b>',
        tags: ['Meta Ads Manager', 'Google Ads', 'HubSpot', 'Mailchimp', 'A/B testing', 'Conversion tracking'],
      },
      {
        name: 'Growth Strategy & Campaigns',
        description: 'SEO, positioning, and campaign strategy for brands moving from invisible to found.',
        projects: '<b>RevoU</b> &middot; <b>Ifurnholic</b> &middot; <b>PPA Academy</b>',
        tags: ['Google Search Console', 'SEMrush', 'Ahrefs', 'SWOT / PMF', 'Google Data Studio'],
      },
      {
        name: 'Multi-brand Marketing Management',
        description: 'Running distinct calendars, targeting, and voice for multiple brands at once without them blurring together.',
        projects: '<b>Digimune Indonesia</b> &middot; Luna Project (Cafero, XBooster, 77) &middot; IndoTek &middot; Andiamo',
        tags: ['Meta Business Suite', 'TikTok Ads Manager'],
      },
    ],
  },
  {
    label: 'Brand & Digital Experience',
    capabilities: [
      {
        name: 'Brand Identity & Visual Foundation',
        description: "Building a brand from nothing, logo, identity system, visual direction, when a business doesn't have one yet.",
        projects: '<b>Soracha</b> &middot; <b>Karsa Tani Perkasa</b> &middot; <b>Sport Center Balikpapan Baru</b>',
        tags: ['Photoshop', 'Canva', 'iPhone 16 photography', 'Social kit design'],
      },
      {
        name: 'Digital Presence & Social Systems',
        description: 'Connecting scattered channels into one findable presence instead of disconnected accounts.',
        projects: '<b>Bauntung Digital</b> &middot; <b>Arkasa Compliance</b>',
        tags: ['Linktree', 'Meta Business Suite', 'Instagram Insights', 'Google Workspace'],
      },
    ],
  },
  {
    label: 'Operations & Systems',
    capabilities: [
      {
        name: 'Operations & Systems Thinking',
        description: 'The discipline underneath the marketing: fleets, factories, compliance systems, and the data tools built to run them.',
        projects: '<b>Blue Tick Ice</b> &middot; <b>PT Transkon Jaya</b> &middot; <b>Putra Perkasa Abadi</b> &middot; <b>Sinar Mas Land</b>',
        tags: ['Python / SQLite', 'ETL pipelines', 'React dashboards', 'AppSheet', 'ISO 9001 / SMK3'],
      },
    ],
  },
];
