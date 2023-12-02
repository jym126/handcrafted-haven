const dotenv = require('dotenv');
dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const MongoClient = require('mongodb').MongoClient;
const dbName = "handcrafted-haven";

class DBConnection {
    constructor() {
        this.client = null;
    }
    async init(callback = this.doNothing) {
        if (this.client != null) {
            console.log('Be aware that database connection is already initialized');
            callback()
            return;
        }
        this.client = new MongoClient(connectionString);
        await this.client.connect();
        callback();
    }
    doNothing() {}
    getClient() {
        if (this.client == null)
            throw Error('Database connection not initialized, call init() first');
        return this.client;
    }
    async queryCollection(collection, query = null) {
        this.initIfNeeded();
        if (query == null) {
            const cursor = this.client.db(dbName).collection(collection).find();
            return await cursor.toArray();
        }
        const cursor = this.client.db(dbName).collection(collection).find(query);
        return await cursor.toArray();
    }
    async initIfNeeded() {
        if (this.client == null)
            await this.init();
    }
    async createDocument(collection, json) {
        this.initIfNeeded();
        const cursor = await this.client.db(dbName).collection(collection).insertOne(json);
        console.log("createDocument cursor: ", cursor);
        return cursor;
    }
    async updateDocument(query, collection, json) {
        this.initIfNeeded();
        const cursor = await this.client.db(dbName).collection(collection).replaceOne(query, json);
        console.log("updateDocument cursor: ", cursor);
        return cursor;
    }
    async deleteDocument(query, collection) {
        this.initIfNeeded();
        const cursor = await this.client.db(dbName).collection(collection).deleteOne(query);
        console.log("deleteDocument cursor: ", cursor);
        return cursor;
    }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  let query = null
  if (category)
    query = { category: category }

  const dbConnection = new DBConnection();
  const products = await dbConnection.queryCollection('products', query);
  return Response.json({ products })
}

/*export default function GET(request) {
    return Response.json({ text: 'Hello' })
}*/
/*
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const product = await res.json()
 
  return Response.json({ product })
}*/