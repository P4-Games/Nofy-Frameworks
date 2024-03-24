import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../utils/db'

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { nick, discordID } = await req.json()

        const db = await connectToDatabase()
        if (!db) throw new Error('Database connection failed.');
        const collection = db.collection('users')

        // Buscar el usuario correspondiente al discordID
        console.log('Searching for user with Discord ID: ', discordID)
        const existingUser = await collection.findOne({ discordID })

        if (existingUser) {
            console.log('The user is already registered.')
            const updatedUser = {
                ...existingUser,
                nick: nick || existingUser.nick,
                discordID: discordID || existingUser.discordID
            }
            await collection.updateOne({ _id: existingUser._id }, { $set: updatedUser })
            console.log('User successfully updated.')
            return NextResponse.json({
                message: 'User updated successfully',
                user: updatedUser
            }, {
                status: 200
            })
        }

        // Crear un nuevo usuario
        console.log('Creating a new user.')
        const newUser = {
            nick,
            discordID,
            characters: [],
            medals: []
        }
        const result = await collection.insertOne(newUser)

        console.log('User created successfully.')
        return NextResponse.json({
            message: 'User created successfully.',
            id: result.insertedId
        }, {
            status: 201
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Server error'
        }, {
            status: 500
        })
    }
}
