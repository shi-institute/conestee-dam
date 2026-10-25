// @sveltejs/enhanced-img only declares the bare `?enhanced` query,
// so imports with extra directives (e.g. `?enhanced&w=112&aspect=1`) need their own declaration.
declare module '*&aspect=1' {
	const value: import('@sveltejs/enhanced-img').Picture;
	export default value;
}
