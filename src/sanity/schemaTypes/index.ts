import type {SchemaTypeDefinition} from 'sanity'

import {about} from './about'
import {poster} from './poster'

export const schemaTypes: SchemaTypeDefinition[] = [poster, about]

/** Document types that exist exactly once, under a fixed document ID. */
export const singletonTypes = new Set(['about'])
