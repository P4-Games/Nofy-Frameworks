import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.DB_KEY ?? ""

const client = uri ? new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}) : null;

export async function connectToDatabase() {
  try {
    if(client){
        await client.connect()
        console.log('Connected to MongoDB successfully!')
        return client.db('frameworks')
    }else{
        console.log('No client')
        return null
    }
  } catch (error) {
    console.log(error)
  }
}

