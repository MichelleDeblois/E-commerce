"use strict";

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Retrieves all products from the database
const getProducts = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("ReservoirCats");

  db.collection("Products")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(500).json({ status: 500, message: err });
      }
      res.status(200).json({ status: 200, data: result });
      client.close();
    });
};

// Retrieves a product based on the id
const getProductById = async (req, res) => {
  const _id = req.params._id;
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("ReservoirCats");

    const product = await db
      .collection("Products")
      //   the id is not stored as a string so the _id from the req has to be parsed into a number
      .findOne({ _id: parseInt(_id) });

    res.status(200).json({ status: 200, data: product });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

// Updates the stock of a product based on id
// relies on the frontend sending the updated stock amount
const updateStock = async (req, res) => {
  // The id from the endpoint is a string so it needs to be parsed to an integer
  // inorder to be found in the database!!!
  const _id = parseInt(req.params._id);
  const query = { _id };
  const newValues = {
    $set: {
      numInStock: req.body.numInStock,
    },
  };

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("ReservoirCats");
    const newStock = await db
      .collection("Products")
      .updateOne(query, newValues);

    res.status(201).json({
      status: 201,
      data: newStock,
      message: "Stock has been updated",
    });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

// Retrieves all the companies listed in the database
const getCompanies = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("ReservoirCats");

  db.collection("Companies")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: err.message });
      }
      res.status(200).json({ status: 200, data: result });
      client.close();
    });
};

// retireves a company based on the company id
const getCompany = async (req, res) => {
  const _id = req.params._id;

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("ReservoirCats");
    const company = await db
      .collection("Companies")
      .findOne({ _id: parseInt(_id) });
    res.status(200).json({ status: 200, data: company });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, message: err.mesage });
  }
  client.close();
};

//Will post the purchases the client makes to the data base
// (Not used yet, for strech goal)
// Format of data undecided (working template)
const postPurchases = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("ReservoirCats");

    await db.collection("Purchases").insertOne(req.body);
    res
      .status(201)
      .json({ status: 201, data: req.body, message: "Purchase created" });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

module.exports = {
  getProducts,
  getProductById,
  updateStock,
  getCompanies,
  getCompany,
  postPurchases,
};
