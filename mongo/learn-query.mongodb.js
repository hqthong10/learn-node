// Create a new database.
use('learn');

db.products.insertMany(
    [
        { "name": "product 1", "price": 400000, "category": "cate 1" },
        { "name": "product 2", "price": 500000, "category": "cate 2" },
        { "name": "product 3", "price": 800000, "category": "cate 3" }
    ]
)

db.products.find({ price: { $gt: 500000 } })

db.products.find({ category: {$in: ["cate 1", "cate 2"] } })

db.products.find({ 
    $or: [
        {category: "cate 1" },
        {price: { $gte: 800000 } },
    ]
})

db.products.find({ name: { $regex: "3" } })

1.
db.products.find({ 
    $and: [
        {price: { $gte: 400000 } },
        {price: { $lte: 800000 } },
    ]
});

2.
db.products.find({ category: {$in: ["cate 1", "cate 3"] } });

3.
db.products.find({ category: { $not: "cate 2" } });

4.
db.products.find({ name: { $regex: "duct" } });

5.
db.products.find({ 
    $or: [
        { price: { $lt: 500000 } },
        { category: "cate 23" },
    ]
});

db.createCollection("users");
db.users.insertMany([
    { _id: 1, name: "Alice", email: "alice@mail.com" },
    { _id: 2, name: "Bob", email: "bob@mail.com" }
]);

db.createCollection("orders");
db.orders.insertMany([
  { _id: 101, userId: 1, product: "Laptop", total: 20000000 },
  { _id: 102, userId: 1, product: "Mouse", total: 300000 },
  { _id: 103, userId: 2, product: "Keyboard", total: 700000 }
]);

db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orderss"
    }
  }
])

db.createCollection("authors");
db.createCollection("books");               
db.authors.insertMany([
  { _id: 1, name: "Alice", email: "alice@mail.com" },
  { _id: 2, name: "Bob", email: "bob@mail.com" }
]);
db.books.insertMany([
  { title: "Book 1", authorId: 1, price: 100000 },
  { title: "Book 2", authorId: 2, price: 200000 },
  { title: "Book 3", authorId: 1, price: 300000 },
  
])

db.books.insertMany([
  { title: "Book 4", authorId: 2, price: 400000 },
  { title: "Book 5", authorId: 1, price: 500000 }
])

db.authors.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "authorId",
      as: "books",
      pipeline: [
        { $match: { price: { $gt: 150000 } } } // chỉ lấy sách giá > 150k
      ]
    }
  },
  {
    $addFields: {
      totalValue: { $sum: "$books.price" }
    }
  },
  { 
    $project: { 
      name: 1,
      "books.title": 1,
      "books.price": 1,
      totalValue: 1
    }
  }
])

db.books.aggregate([
  {
    $group: {
      _id: "$authorId",
      totalPrice: { $sum: "$price" }
    }
  },
  {
    $sort: {
      totalPrice: -1
    }
  },
  { $limit: 1 }
])

1.
db.books.aggregate([
  {
    $group: {
      _id: "$authorId",
      totalPrice: { $sum: "$price" }
    }
  }
])

2.
db.books.aggregate([
  {
    $group: {
      _id: "$authorId",
      totalPrice: { $sum: "$price" }
    }
  },
  {
    $match: {
      totalPrice: { $gt: 700000 }
    }
  }
])

3.
db.books.aggregate([
  {
    $group: {
      _id: "$authorId",
      totalPrice: { $sum: "$price" }
    }
  },
  {
    $sort: {
      totalPrice: -1
    }
  }
])

4.
db.books.aggregate([
  {
    $group: {
      _id: "$authorId",
      totalPrice: { $sum: "$price" }
    }
  },
  {
    $addFields: {
      tax: { $multiply: ["$totalPrice", 0.1] },
    }
  },
  {
    $addFields: {
      totalAfterTax: { $add: ["$totalPrice", "$tax"] }
    }
  }
])


db.books.getIndexes()

db.books.createIndex({ price: 1 })

db.books.dropIndex("price_1")