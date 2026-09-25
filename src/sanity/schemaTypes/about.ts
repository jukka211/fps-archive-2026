import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'

// Paragraphs with links only — the About page has a single text style.
const simpleBlock = defineArrayMember({
  type: 'block',
  styles: [],
  lists: [],
  marks: {
    decorators: [],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (rule) => rule.required().uri({scheme: ['http', 'https', 'mailto']}),
          }),
        ],
      },
    ],
  },
})

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [simpleBlock],
    }),
    defineField({
      name: 'colophon',
      description: 'Credit line. Not shown on the site at the moment.',
      type: 'array',
      of: [simpleBlock],
    }),
  ],
  preview: {
    prepare: () => ({title: 'About'}),
  },
})
