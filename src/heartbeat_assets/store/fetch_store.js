import { writable } from 'svelte/store';

export const fetch_store = writable({ isFetching: false, logs: [] });
export const fetch_store_fetching = function () {
	fetch_store.update(({ logs }) => {
		return {
			isFetching: true,
			logs: logs
		};
	});
};
