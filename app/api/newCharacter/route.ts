import { connectToDatabase } from '../../../utils/db'
import { storageUrlGamma } from '../../../utils/config'
import { NextRequest, NextResponse } from 'next/server'

const getRandomCharacterID = async (db: any, channelId: any) => {
    const serversCollection = db.collection('servers')
    const server = await serversCollection.findOne({
        channelId
    })

    if (!server) {
        throw new Error(`Server not found for channelId: ${channelId}`)
    }

    const characterID = server.nofy

    if (characterID === null) {
        return null // Personaje ya fue reclamado
    } else if (characterID === 0) {
        return 0 // Número aleatorio no encontrado
    }

    return characterID
}

const findUserByDiscordID = async (db: any, discordID: any) => {
    const collection = db.collection('users')
    const user = await collection.findOne({
        discordID
    })

    if (!user) {
        throw new Error(
            `User with Discord ID: ${discordID} not found. If you haven't registered yet, please use the command **/start** to begin playing.`
        )
    }

    return user
}

const findCharacterByID = async (db: any, characterID: any) => {
    const characterImage = `${storageUrlGamma}/T2/${characterID}.png`
    const charactersCollection = db.collection('characters')
    const character = await charactersCollection.findOne({
        image: characterImage
    })

    if (!character) {
        throw new Error(`Character not found or missing image for characterID: ${characterID}`)
    }

    return { id: characterID, image: characterImage }
}

const addCharacterToInventory = async (db: any, userID: any, characterID: any, characterImage: any) => {
    const userCollection = db.collection('users')

    await userCollection.updateOne(
        { _id: userID },
        {
            $addToSet: {
                characters: {
                    id: characterID,
                    image: characterImage
                }
            }
        }
    )
}

export default async function PUT(req: NextRequest, res: NextResponse) {
    if (req.method !== 'PUT') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    try {
        const body = await req.json();
        const { discordID, channelID } = body;

        const db = await connectToDatabase()
        if(!db) return;
        const user = await findUserByDiscordID(db, discordID)

        if (!user) {
            return NextResponse.json({
                message: `User with Discord ID: ${discordID} not found. If you haven't registered yet, please use the command **/start** to begin playing.`
            })
        }

        const characterID = await getRandomCharacterID(db, channelID)

        if (characterID === null) {
            return NextResponse.json({
                message: 'The character has already been collected.'
            }, {
                status: 200
            })
        }

        const character = user.characters.find((c: any) => c.id.toString() === characterID.toString())

        if (character) {
            return NextResponse.json({
                message: 'You already have this character in your inventory.'
            }, {
                status: 200
            })
        }

        const characterObj = await findCharacterByID(db, characterID)
        await addCharacterToInventory(db, user._id, characterObj.id, characterObj.image)

        const serversCollection = db.collection('servers')
        await serversCollection.updateOne({ channelId: channelID }, { $set: { nofy: null } })

        return NextResponse.json({
            message: 'Character added successfully.',
            image: characterObj.image
        })
    } catch (error: any) {
        console.error(error)

        if (error.message.includes('User with Discord ID:')) {
            return NextResponse.json({ message: error.message })
        } else {
            return NextResponse.json({ message: 'Server error' })
        }
    }
}
