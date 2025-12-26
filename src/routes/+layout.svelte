<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Shawty</a>
	<a href="/dashboard">Dashboard</a>
	<a href="/auth/logout">Logout</a>
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border-bottom: 1px solid #ddd;
		align-items: center;
	}
</style>
