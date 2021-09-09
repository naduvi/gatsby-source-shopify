import { BulkQuery } from "./bulk-query"

export class CollectionsQuery extends BulkQuery {
  query(date?: Date): string {
    const publishedStatus = this.pluginOptions.salesChannel
      ? `'${encodeURIComponent(this.pluginOptions.salesChannel)}:visible'`
      : `published`

    const filters = [`published_status:${publishedStatus}`]
    if (date) {
      const isoDate = date.toISOString()
      filters.push(`created_at:>='${isoDate}' OR updated_at:>='${isoDate}'`)
    }

    const queryString = filters.map(f => `(${f})`).join(` AND `)

    const query = `
      {
        collections(query: "${queryString}") {
          edges {
            node {
              products {
                edges {
                  node {
                    id
                  }
                }
              }
              handle
              id
              image {
                id
                altText
                height
                width
                originalSrc
                transformedSrc
              }
              legacyResourceId
              storefrontId
              title
            }
          }
        }
      }
      `

    return this.bulkOperationQuery(query)
  }
}
