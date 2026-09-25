import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {ImageIcon} from '@sanity/icons/Image'
import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {slugify} from '../slugify'

export const poster = defineType({
  name: 'poster',
  title: 'Poster',
  type: 'document',
  icon: ImageIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'poster'}),
    defineField({
      name: 'title',
      title: 'Film title',
      description: 'Shown in quotes in the header, e.g. “Echo” 2023.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page URL',
      description:
        'Address of the project page, e.g. “echo” → /projects/echo. Click “Generate” to create it from the title; must be unique.',
      type: 'slug',
      options: {source: 'title', slugify},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'image',
      title: 'Poster',
      description: 'WebP, JPG, PNG or animated GIF. Portrait (A-series ratio) looks best.',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'credits',
      description: 'Shown along the bottom of the page, in this order. Put Poster Design first.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'credit',
          type: 'object',
          icon: UserIcon,
          fields: [
            defineField({
              name: 'role',
              description: 'e.g. Poster Design, Director, Producer, Cameraman',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              description: 'One or more people, e.g. “Felix Krisai & Pipi Fröstl”',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              description: 'Optional website, Instagram or mailto: link for the name.',
              type: 'url',
              validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto']}),
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', year: 'year', media: 'image'},
    prepare: ({title, year, media}) => ({
      title: title ? `“${title}”` : 'Untitled',
      subtitle: year ? String(year) : undefined,
      media,
    }),
  },
})
