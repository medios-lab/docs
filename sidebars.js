/**
 * Medios public documentation sidebar (medios-lab/docs).
 * Modeled on docs.k3s.io: strict 2-level max depth, clickable category landings,
 * operator-lifecycle ordering, quarantined CLI/API reference, unversioned living docs.
 *
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docsSidebar: [
    'overview',
    'quick-start',
    {
      type: 'category',
      label: 'Installation',
      link: { type: 'doc', id: 'installation/index' },
      items: [
        'installation/requirements',
        'installation/install',
        'installation/docker',
        'installation/build-from-source',
        'installation/uninstall',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      link: { type: 'doc', id: 'architecture/index' },
      items: [
        'architecture/offers',
        'architecture/containerizers',
        'architecture/task-lifecycle',
        'architecture/networking',
      ],
    },
    {
      type: 'category',
      label: 'Cluster Operations',
      link: { type: 'doc', id: 'operations/index' },
      items: [
        'operations/persistence',
        'operations/leader-election',
        'operations/upgrades',
        'operations/maintenance',
        'operations/gpus',
        'operations/stores',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      link: { type: 'doc', id: 'security/index' },
      items: [
        'security/tls',
        'security/authentication',
        'security/authorization',
        'security/hardening',
      ],
    },
    {
      type: 'category',
      label: 'Workloads & Task Features',
      link: { type: 'doc', id: 'workloads/index' },
      items: [
        'workloads/containers',
        'workloads/task-uris',
        'workloads/task-observers',
        'workloads/first-observed-task',
        'workloads/watch-for-nan',
        'workloads/progress-and-stalls',
        'workloads/finish-hooks',
        'workloads/gang-admission',
      ],
    },
    {
      type: 'category',
      label: 'Building Frameworks',
      link: { type: 'doc', id: 'frameworks/index' },
      items: [
        'frameworks/contract',
        'frameworks/sandboxes',
        'frameworks/agents',
        'frameworks/cpp-driver',
        'frameworks/ray-on-medios',
      ],
    },
    {
      type: 'category',
      label: 'Go SDK',
      link: { type: 'doc', id: 'go-sdk/index' },
      items: [
        'go-sdk/writing-a-framework',
        'go-sdk/packages',
        'go-sdk/examples',
      ],
    },
    {
      type: 'category',
      label: 'CLI Tools',
      link: { type: 'doc', id: 'cli/index' },
      items: [
        'cli/controller',
        'cli/node',
        'cli/execute',
        'cli/helpers',
      ],
    },
    {
      type: 'category',
      label: 'HTTP API & OpenAPI',
      link: { type: 'doc', id: 'api/index' },
      items: [
        'api/openapi',
        'api/scheduler',
        'api/operator',
        'api/executor',
        'api/recordio',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/env-variables',
        'reference/task-state-reasons',
        'reference/task-fields',
        'reference/metrics',
      ],
    },
    {
      type: 'category',
      label: 'Release Notes',
      items: [
        'release-notes/v1.0.x',
      ],
    },
    'known-issues',
    'faq',
  ],
};

module.exports = sidebars;
