<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';

	import PageNavigation from 'heartbeat-components/components/PageNavigation.svelte';
	import DataGrid from 'heartbeat-components/components/DataGrid.svelte';

	import { actor_health_metrics } from '$stores_ref/actors.js';
	import { fetch_store, fetch_store_fetching } from '$stores_ref/fetch_store.js';

	fetch_store_fetching();

	onMount(async () => {
		try {
			const all_logs = await $actor_health_metrics.actor.get_unique_logs();

			const converted_logs = all_logs.map((log) => {
				const date_converted = dayjs(Number(log.time) / 1000000).toISOString();

				const converted_log = {
					...log,
					time: dayjs(date_converted).format('YYYY-MM-DD HH:mm:ss')
				};

				return converted_log;
			});

			fetch_store.set({ isFetching: false, logs: converted_logs });
		} catch (error) {
			console.error('error: call', error);
		}
	});

	async function handleItemClick(e) {
		const { column, row } = e.detail;

		if (column === 'id') {
			const canister_id = row.id;

			goto(`/canister/${canister_id}`);
		}
	}
</script>

<svelte:head>
	<title>Heartbeat</title>
</svelte:head>

<main class="hidden lg:grid grid-cols-12 gap-y-2 relative">
	<div class="col-start-2 col-end-12 mb-8">
		<PageNavigation navItems={[{ name: 'Canisters', href: '', isSelected: true }]} />
	</div>

	{#if $fetch_store.isFetching}
		<div class="col-start-2 col-end-12">
			<div class="flex justify-center">
				<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
			</div>
		</div>
	{:else}
		<div class="col-start-2 col-end-12">
			<div class="mb-10">
				<DataGrid
					data={$fetch_store.logs}
					on:itemClick={handleItemClick}
					columns={['id', 'time', 'name', 'cycles_balance', 'memory_in_mb', 'heap_in_mb']}
				/>
			</div>
		</div>
	{/if}
</main>

<style>
</style>
