import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('blog post OGP images use the post heroImage asset', async () => {
	const postPath = 'dist/blog/2026-05-07-agentic-restaurant-ordering-and-payment/index.html';
	const html = await readFile(postPath, 'utf8');

	const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/u)?.[1];
	const twitterImage = html.match(/<meta property="twitter:image" content="([^"]+)"/u)?.[1];

	assert.ok(ogImage, 'og:image meta tag should exist');
	assert.ok(twitterImage, 'twitter:image meta tag should exist');
	assert.match(
		ogImage,
		/agentic-restaurant-ordering-hero\.[^/]+\.(?:png|webp)$/u,
		'blog post og:image should use the post heroImage asset',
	);
	assert.match(
		twitterImage,
		/agentic-restaurant-ordering-hero\.[^/]+\.(?:png|webp)$/u,
		'blog post twitter:image should use the post heroImage asset',
	);
});
