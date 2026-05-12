-  delete index (table)
await client.indices.delete({
  index: 'products'
})

- create index (table)
await client.indices.create({
    index: 'products',
    mappings: {
    properties: {
        name: { type: "text" },
        price: { type: "float" },
        category: { type: "keyword" },
        created_at: { type: "date" }
      }
    }
});

- instert data
await client.index({
    index: 'products',
    id: 1,
    document: {
      name: "iPhone 15",
      price: 1000,
      category: "phone",
      created_at: new Date()
    }
})

# search
const result = await client.search({
  index: "products",
  query: {
    match_all: {}
  }
})
console.log(result.hits.hits)


const result = await client.search({
  index: "products",
  query: {
    match: {
      name: "iphone"
    }
  }
})


const result = await client.search({
  index: "products",
  query: {
    term: {
      category: "phone"
    }
  }
})


const result = await client.search({
  index: "products",
  query: {
    range: {
      price: {
        gte: 500,
        lte: 1500
      }
    }
  }
})


const result = await client.search({
  index: "products",
  query: {
    bool: {
      must: [
        { match: { name: "iphone" } }
      ],
      filter: [
        { term: { category: "phone" } }
      ]
    }
  }
})


const result = await client.search({
  index: "products",
  from: 0,
  size: 10,
  query: {
    match_all: {}
  }
})


const result = await client.search({
  index: "products",
  sort: [
    { price: "asc" }
  ],
  query: {
    match_all: {}
  }
})


const result = await client.search({
  index: "products",
  query: {
    multi_match: {
      query: "iphone",
      fields: ["name", "description"]
    }
  }
})


// Autocomplete search
const result = await client.search({
  index: "products",
  query: {
    match_phrase_prefix: {
      name: "iph"
    }
  }
})