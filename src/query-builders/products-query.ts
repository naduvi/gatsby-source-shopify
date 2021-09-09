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
              createdAt
              handle
              legacyResourceId
              publishedAt
              status
              tags
              title
              description
              totalInventory
              updatedAt
              vendor
              priceRangeV2 {
                maxVariantPrice {
                  amount
                  currencyCode
                }
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
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
                    createdAt
                    description
                    id
                    key
                    legacyResourceId
                    namespace
                    ownerType
                    updatedAt
                    value
                    type
                    valueType: type
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
