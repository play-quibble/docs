// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://play-quibble.github.io',
	base: '/docs',
	integrations: [
		starlight({
			title: 'Quibble',
			description: 'Self-hosted live trivia for Kubernetes',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/play-quibble/trivia' },
			],
			editLink: {
				baseUrl: 'https://github.com/play-quibble/docs/edit/main/',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Requirements', slug: 'getting-started/requirements' },
					],
				},
				{
					label: 'Deployment',
					items: [
						{ label: 'Docker Compose', slug: 'deployment/docker-compose' },
						{ label: 'Kubernetes / Helm', slug: 'deployment/helm' },
						{ label: 'Going to Production', slug: 'deployment/production' },
					],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'Environment Variables', slug: 'configuration/environment-variables' },
						{ label: 'Auth0 Setup', slug: 'configuration/auth0' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'REST API', slug: 'api-reference/rest-api' },
						{ label: 'WebSocket Protocol', slug: 'api-reference/websocket-protocol' },
					],
				},
				{
					label: 'Self-Hosting',
					items: [
						{ label: 'Backups & Restore', slug: 'self-hosting/backups' },
						{ label: 'Upgrades', slug: 'self-hosting/upgrades' },
						{ label: 'Monitoring', slug: 'self-hosting/monitoring' },
					],
				},
				{ label: 'Contributing', slug: 'contributing' },
			],
		}),
	],
});
