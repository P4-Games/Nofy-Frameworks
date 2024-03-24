import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.DB_KEY ?? 'mongodb://localhost:27017'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connectToDatabase() {
  try {
    await client.connect()
    console.log('Connected to MongoDB successfully!')
    return client.db('frameworks')
  } catch (error) {
    console.log(error)
  }
}

