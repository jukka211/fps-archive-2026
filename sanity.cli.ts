/**
 * Config for the `sanity` CLI (e.g. `npx sanity exec`, `npx sanity cors add`).
 */
import {defineCliConfig} from 'sanity/cli'

import {dataset, projectId} from './src/sanity/env'

export default defineCliConfig({api: {projectId, dataset}})
