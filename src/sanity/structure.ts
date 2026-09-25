import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {ImageIcon} from '@sanity/icons/Image'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('FPS Archive')
    .items([
      orderableDocumentListDeskItem({
        type: 'poster',
        title: 'Project-Posters',
        icon: ImageIcon,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('About')
        .icon(InfoOutlineIcon)
        .child(S.document().schemaType('about').documentId('about').title('About')),
    ])
