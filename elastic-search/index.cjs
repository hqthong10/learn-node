const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200'
})

async function test() {
  const result = await client.info()
  console.log(result)
}

async function do_insert() {
  await client.index({
    index: 'products',
    // id: 1,
    document: {
      name: "iPhone 18",
      price: 1600,
      category: "phone",
      created_at: new Date()
    }
  })
}

async function do_search() {
  const result = await client.search({
    index: "products",
    query: {
      match_all: {}
    }
  })
  console.log(result.hits.hits);
}

// test();

do_insert();

// do_search();


module.exports = client