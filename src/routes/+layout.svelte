<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
	
	<nav class="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
		<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
				shawty
			</a>
			<div class="flex items-center gap-4">
				{#if data?.user}
					<a href="/dashboard" class="px-4 py-2 rounded-lg bg-zinc-800 border border-transparent hover:border-zinc-600 hover:border hover:bg-zinc-700 text-sm transition-colors">
						Dashboard
					</a>
					<a href="/leaderboard" class="px-4 py-2 rounded-lg bg-zinc-800 border border-transparent hover:border-zinc-600 hover:border hover:bg-zinc-700 text-sm transition-colors">
						Leaderboard
					</a>
					<a href="/auth/logout" class="px-4 py-2 rounded-lg bg-red-900 border border-transparent hover:border-red-600 hover:bg-red-700 text-sm transition-colors">
						Logout
					</a>
				{:else}
					<a href="/leaderboard" class="px-4 py-2 rounded-lg bg-zinc-800 border border-transparent hover:border-zinc-600 hover:border hover:bg-zinc-700 text-sm transition-colors">
						Leaderboard
					</a>
					<a href="/login" class="px-4 py-2 rounded-lg bg-white text-zinc-900 hover:bg-zinc-200 text-sm font-medium transition-colors">
						Log in
					</a>
				{/if}
			</div>
		</div>
	</nav>

	<main class="flex-1  min-h-[calc(100vh-16rem)]">
		{@render children()}
	</main>

	<footer class="border-t border-zinc-800 bg-zinc-900/50">
		<div class="max-w-5xl mx-auto px-6 py-8">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">

				<div>
					<h3 class="text-lg font-bold mb-3">shawty</h3>
					<p class="text-sm text-zinc-400">
						Simple and short links.
					</p>
				</div>


				<div>
					<h4 class="text-sm font-semibold mb-3 text-zinc-300">Links</h4>
					<ul class="space-y-2 text-sm text-zinc-400">
						<li><a href="/" class="hover:text-zinc-200 transition-colors">Home</a></li>
						<li><a href="/dashboard" class="hover:text-zinc-200 transition-colors">Dashboard</a></li>

					</ul>
				</div>


				<div>
					<h4 class="text-sm font-semibold mb-3 text-zinc-300">Connect</h4>
					<ul class="space-y-2 text-sm text-zinc-400">

						<li><a href="https://hackclub.enterprise.slack.com/team/U0930DMR4BA" class="hover:text-zinc-200 transition-colors">@Vejas on Slack</a></li>
						<li><a href="https://github.com/las-vejas/shawty" class="hover:text-zinc-200 transition-colors">GitHub Repo</a></li>
						
					</ul>
				</div>
			</div>

			<!-- Bottom bar -->
			<div class="mt-8 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-400">
				<p>&copy; {new Date().getFullYear()} shawty. Built with ❤️ by <a href="https://vejas.zip" class="text-decoration-underline">Vejas</a></p>
			</div>
		</div>
	</footer>
</div>
