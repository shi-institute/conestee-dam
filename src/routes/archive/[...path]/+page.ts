// this route only renders from the fallback page, before the service worker is proxying the archive
export const prerender = false;
export const ssr = false;
// keep archive urls exactly as requested (e.g. no slash after about.html)
export const trailingSlash = 'ignore';
