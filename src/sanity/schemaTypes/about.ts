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
      name: 'rows',
      title: 'Rows below the text',
      description: 'Listed under the text as on the Index: FPS, the title, then everything in it, e.g. past presentations.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              description: 'e.g. Past presentations',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              description: 'Comma-separated, e.g. “Rundgang, Academy of Fine Arts Stuttgart, 2022, BestOFF, …”',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text'},
          },
        }),
      ],
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
