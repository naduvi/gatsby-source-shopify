import { BulkQuery } from "./bulk-query"

export class ProductVariantsQuery extends BulkQuery {
  query(date?: Date): string {
    const publishedStatus = this.pluginOptions.salesChannel
      ? `'${encodeURIComponent(this.pluginOptions.salesChannel)}:visible'`
      : `published`

    const filters = [`status:active`, `published_status:${publishedStatus}`]
    if (date) {
      const isoDate = date.toISOString()
      filters.push(`created_at:>='${isoDate}' OR updated_at:>='${isoDate}'`)
    }

    const ProductVariantSortKey = `POSITION`

    const queryString = filters.map(f => `(${f})`).join(` AND `)

    const query = `
      {
        products(query: "${queryString}") {
          edges {
            node {
              id
              variants(sortKey: ${ProductVariantSortKey}) {
                edges {
                  node {
                    availableForSale
                    barcode
                    compareAtPrice
                    createdAt
                    displayName
                    id
                    price
                    sku
                    storefrontId
                    inventoryQuantity
                    title
                    updatedAt
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
          }
        }
      }
    `

    return this.bulkOperationQuery(query)
  }
}
