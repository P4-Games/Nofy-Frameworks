import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../utils/db'
import { useParams, useSearchParams } from 'next/navigation'
import { headers } from 'next/headers'

export default async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = useSearchParams()

    const channelId = searchParams.get('channelId')

    try {
        const db = await connectToDatabase()
        if(!db) return;
        const serversCollection = db.collection('servers')

        // Generar un nuevo número aleatorio
        const newRandomInt = Math.floor(Math.random() * 120)

        // Actualizar el número aleatorio en la base de datos para el channelId proporcionado
        if (newRandomInt === 0) {
            await serversCollection.updateOne({ channelId }, { $set: { nofy: 0 } })
        } else {
            await serversCollection.updateOne({ channelId }, { $set: { nofy: newRandomInt } })
        }

        return NextResponse.json({
            newRandomInt,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: 'An error occurred while processing your request.'
        }, {
            status: 500
        })
    }
}
