import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as idl_health_metrics } from '$IDLhealth_metrics';

import { writable } from 'svelte/store';
import environment from 'environment';

const env = environment();

const isProd = env['DFX_NETWORK'] === 'ic';

export function createActor(options) {
	const canisterIds = env.canisterIds[options.actor_name];
	const canisterId = canisterIds[env['DFX_NETWORK']];

	const host = isProd ? `https://${canisterId}.ic0.app/` : `http://127.0.0.1:8080`;

	const agentOptions = { host };

	const idl_reference = {
		health_metrics: idl_health_metrics
	};

	if (options && options.identity) {
		agentOptions.identity = options.identity;
	}

	const agent = new HttpAgent({ ...agentOptions });

	// Fetch root key for certificate validation during development
	if (!isProd) {
		agent.fetchRootKey().catch((err) => {
			console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
			console.error(err);
		});
	}

	// Creates an actor with using the candid interface and the HttpAgent
	return Actor.createActor(idl_reference[options.actor_name], {
		agent,
		canisterId
	});
}

export const actor_health_metrics = writable({
	loggedIn: false,
	actor: createActor({ actor_name: 'health_metrics' })
});
