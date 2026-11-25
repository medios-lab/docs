// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Medios Documentation',
  tagline: 'A resource broker for agentic and AI workloads',
  favicon: 'img/favicon.svg',

  url: 'https://medios-lab.github.io',
  baseUrl: '/docs/',

  organizationName: 'medios-lab',
  projectName: 'docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/medios-lab/docs/edit/main/',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Medios',
        logo: {
          alt: 'Medios Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/api/openapi',
            label: 'OpenAPI',
            position: 'left',
          },
          {
            to: '/go-sdk',
            label: 'Go SDK',
            position: 'left',
          },
          {
            href: 'https://github.com/medios-lab/medios',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Overview', to: '/' },
              { label: 'Quick-Start Guide', to: '/quick-start' },
              { label: 'Architecture', to: '/architecture' },
              { label: 'CLI Tools', to: '/cli' },
            ],
          },
          {
            title: 'Developers',
            items: [
              { label: 'Building Frameworks', to: '/frameworks' },
              { label: 'Go SDK', to: '/go-sdk' },
              { label: 'OpenAPI Specs', to: '/api/openapi' },
              { label: 'Scheduler HTTP API', to: '/api/scheduler' },
            ],
          },
          {
            title: 'Repositories',
            items: [
              { label: 'medios-lab/medios', href: 'https://github.com/medios-lab/medios' },
              { label: 'medios-lab/medios-sdk-go', href: 'https://github.com/medios-lab/medios-sdk-go' },
              { label: 'medios-lab/docs', href: 'https://github.com/medios-lab/docs' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Medios Authors. Licensed under Apache 2.0.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'go', 'python', 'cpp'],
      },
    }),
};

module.exports = config;
