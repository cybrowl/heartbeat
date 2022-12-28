<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import get from 'lodash/get';
	import last from 'lodash/last';

	import PageNavigation from 'heartbeat-components/components/PageNavigation.svelte';
	import CanisterChart from 'heartbeat-components/components/CanisterChart.svelte';

	import { actor_health_metrics } from '$stores_ref/actors.js';
	import { fetch_store, fetch_store_fetching } from '$stores_ref/fetch_store.js';

	fetch_store_fetching();

	onMount(async () => {
		try {
			const canister_id = last(get($page, 'url.pathname', '').split('/'));

			const all_logs = await $actor_health_metrics.actor.get_canister_logs(canister_id);

			console.log('all_logs: ', all_logs);

			const canister_logs = all_logs.map((log_data) => {
				const metrics_data = transform_for_bar_chart(log_data);
				const meters_data = transform_for_meters(log_data);
				const cycles_data = get_cycles_metric(log_data);
				const last_elem = get_last_elem(log_data);

				const canister_log = {
					metrics_data,
					meters_data,
					cycles_data,
					last_elem
				};

				return canister_log;
			});

			fetch_store.set({ isFetching: false, logs: canister_logs });
		} catch (error) {
			console.error('error: call', error);
		}
	});

	function transform_for_bar_chart(metrics_data) {
		function convert_timestamp_to_date(timestamp) {
			const dt = dayjs(Number(timestamp) / 1000000).toISOString();
			return dt;
		}

		let metrics_converted = metrics_data.map((metric) => {
			let all_metrics = [];

			// loop over metric.metrics
			for (const [key, value] of metric.metrics) {
				// explore key cycles_balance
				if (key !== 'cycles_balance') {
					all_metrics.push({
						group: key,
						date: convert_timestamp_to_date(metric.time),
						value: Number(value)
					});
				}
			}

			return all_metrics;
		});

		return metrics_converted.flat();
	}

	function transform_for_meters(metrics_data) {
		let all_metrics = [];

		const last_elem = metrics_data[metrics_data.length - 1];

		for (const [key, value] of last_elem.metrics) {
			if (key == 'memory_in_mb' || key == 'heap_in_mb') {
				all_metrics.push({
					group: key,
					value: Number(value)
				});
			}
		}

		return all_metrics;
	}

	function get_cycles_metric(metrics_data) {
		const last_elem = metrics_data[metrics_data.length - 1];

		for (const [key, value] of last_elem.metrics) {
			if (key == 'cycles_balance') {
				return {
					group: key,
					value: Number(value)
				};
			}
		}
	}

	function get_last_elem(metrics_data) {
		const last_elem = metrics_data[metrics_data.length - 1];
		return last_elem;
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
			{#each $fetch_store.logs as log}
				<div class="mb-10">
					<CanisterChart
						title={'Canister Metrics'}
						name={log.last_elem.name}
						child_canister_id={log.last_elem.child_canister_id}
						parent_canister_id={log.last_elem.parent_canister_id}
						metrics_data={log.metrics_data}
						meters_data={log.meters_data}
						cycles_data={log.cycles_data}
					/>
				</div>
			{/each}
		</div>
	{/if}
</main>

<style>
</style>
