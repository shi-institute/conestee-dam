/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { base } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

// requests under this path are proxied to the archive of the original site
const ARCHIVE_PREFIX = `${base}/archive`;
const ARCHIVE_ORIGIN = 'https://shi-institute.github.io/conestee-dam-archive';

// take control of open pages immediately so the archive route can reload into the proxy
sw.addEventListener('install', () => sw.skipWaiting());
sw.addEventListener('activate', (event) => event.waitUntil(sw.clients.claim()));

sw.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (url.origin !== sw.location.origin) return;
	if (url.pathname !== ARCHIVE_PREFIX && !url.pathname.startsWith(`${ARCHIVE_PREFIX}/`)) return;

	// the archive uses relative links, so it must be served from a path with a trailing slash
	if (url.pathname === ARCHIVE_PREFIX) {
		event.respondWith(Response.redirect(`${ARCHIVE_PREFIX}/${url.search}`, 301));
		return;
	}

	const upstream = ARCHIVE_ORIGIN + url.pathname.slice(ARCHIVE_PREFIX.length) + url.search;

	// CORS hides Content-Range from us, so let media and other range requests go straight upstream
	const isMedia = event.request.destination === 'video' || event.request.destination === 'audio';
	if (isMedia || event.request.headers.has('range')) {
		event.respondWith(Response.redirect(upstream, 302));
		return;
	}

	event.respondWith(
		fetch(upstream, { mode: 'cors', credentials: 'omit' }).then(
			// rebuild the response: browsers reject navigations answered with a redirected response
			(res) => new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers })
		)
	);
});
