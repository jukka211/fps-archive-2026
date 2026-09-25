'use client'

/**
 * Sanity Studio, mounted in the Next.js app at /studio
 * (see src/app/(studio)/studio/[[...tool]]/page.tsx).
 */
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes, singletonTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// Singletons can only be edited: no duplicate, delete or unpublish.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  basePath: '/studio',
  title: 'FPS Archive',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion})],
})
