import { BulkQuery } from "./bulk-query"

export class ProductsQuery extends BulkQuery {
  query(date?: Date): string {
    const publishedStatus = this.pluginOptions.salesChannel
      ? `'${encodeURIComponent(this.pluginOptions.salesChannel)}:visible'`
      : `published`

    const filters = [`status:active`, `published_status:${publishedStatus}`]
    if (date) {
      const isoDate = date.toISOString()
      filters.push(`created_at:>='${isoDate}' OR updated_at:>='${isoDate}'`)
    }

    const ProductImageSortKey = `POSITION`

    const queryString = filters.map(f => `(${f})`).join(` AND `)

    const query = `
      {
        products(query: "${queryString}") {
          edges {
            node {
              id
              storefrontId
              description
              handle
              tags
              title
              vendor
              images(sortKey: ${ProductImageSortKey}) {
                edges {
                  node {
                    id
                    altText
                    src
                    originalSrc
                    width
                    height
                  }
                }
              }
              variants {
                edges {
                  node {
                    id
                  }
                }
              }
              metafields {
                edges {
                  node {
                    key
                    namespace
                    value
                  }
                }
              }
            }
          }
        }
      }
    `

    return this.bulkOperationQuery(query)
  }
}
