import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export default clientPromise