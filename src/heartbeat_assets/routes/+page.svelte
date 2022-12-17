<script>
	import PageNavigation from 'heartbeat-components/components/PageNavigation.svelte';
</script>

<svelte:head>
	<title>Heartbeat</title>
</svelte:head>

<main class="hidden lg:grid grid-cols-12 gap-y-2 relative">
	<div class="col-start-2 col-end-12 mb-8">
		<PageNavigation navItems={[{ name: 'Canisters', href: '', isSelected: true }]} />
	</div>
</main>

<style>
</style>
