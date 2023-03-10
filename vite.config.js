// import { terser } from 'rollup-plugin-terser';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

import { generateCanisterAliases, getEnvironmentPath } from './config/dfx.config.cjs';

const isDevelopment = process.env.DFX_NETWORK !== 'ic';
const isProduction = process.env.DFX_NETWORK === 'ic';

const aliases = generateCanisterAliases();
const environment = getEnvironmentPath(isDevelopment);

const envOptions = {
	isDevelopment,
	isProduction,
	aliases,
	environment
};

const config = {
	server: {
		fs: {
			allow: ['config', '.dfx/local']
		}
	},
	resolve: {
		alias: {
			...envOptions.aliases,
			$components_ref: resolve('./src/heartbeat_assets/components/'),
			$stores_ref: resolve('./src/heartbeat_assets/store/'),
			environment: envOptions.environment
		},
		dedupe: ['svelte']
	},
	plugins: [sveltekit()]
};

export default config;
