import { ObjectId } from 'mongodb';
import { CHANNEL_ID } from "@/constants/db";
import { storageUrlGamma } from "@/utils/config";
import { connectToDatabase } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Define the type for a character
interface Character {
    id: any;
    dateClaimed: Date;
}

// Define the type for a user
interface User {
    discordID: string;
    characters: Character[]; // Define the characters field as an array of Character
}

const getCharacterStatus = async () => {
    const db = await connectToDatabase()
    if(!db) return;
    const serversCollection = db.collection('servers')
    const server = await serversCollection.findOne({
        channelId: CHANNEL_ID,
    })

    if (!server) {
        throw new Error(`Server not found for channelId: ${CHANNEL_ID}`)
    }

    let characterID = server.nofy;

    const serverDate = new Date(server.generatedDate);
    const currentDate = new Date();
    const elapsedTime = currentDate.getTime() - serverDate.getTime();
    const elapsedMinutes = elapsedTime / (1000 * 60);

    if(elapsedMinutes > 15) {
        characterID = Math.floor(Math.random() * 120);

        let res = await serversCollection.updateOne(
            { _id: new ObjectId("65d0f080707968958eeeaecc") },
            {
                $set: {
                    nofy: characterID,
                    claimedBy: "",
                    generatedDate: new Date()
                }
            }
        )
    }

    const characterImage = `${storageUrlGamma}/T2/${characterID}.png`

    return { id: characterID, image: characterImage, claimedBy: server?.claimedBy, remainingTime: 15 - elapsedMinutes}
}

const claimNOF = async function (FID: string) {
    try {
        const db = await connectToDatabase()
        if(!db) return;
        const serversCollection = db.collection('servers')
        const server = await serversCollection.findOne({
            channelId: CHANNEL_ID,
        })

        if (!server) {
            throw new Error(`Server not found for channelId: ${CHANNEL_ID}`)
        }

        if(server.claimedBy) {
            return {
                message: 'Character already claimed'
            }
        }

        const characterID = server.nofy;

        const userCollection = db.collection<User>('users') // Specify the User type here
        const user = await userCollection.findOne({
            discordID: FID
        })

        if(!user) {
            return {
                message: 'User not found'
            }
        }

        // Comprobando si el usuario ya tiene el personaje
        const character = user.characters.find(c => c.id.toString() === characterID.toString());

        if (character) {
            return {
                message: 'Character already in your inventory'
            }
        }

        // Añadir el personaje al inventario del usuario
        await userCollection.updateOne(
            { discordID: FID },
            { $push: { characters: { id: characterID, dateClaimed: new Date() } } }
        );

        await serversCollection.updateOne(
            { _id: new ObjectId(server._id) },
            {
                $set: {
                    claimedBy: FID,
                }
            }
        )

        return {
            message: 'Character claimed successfully and added to your inventory',
        }
    } catch (error) {
        console.log(error)
        return {
            message: 'Server error'
        }
    }
}


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const status = await getCharacterStatus();

        // Obtener DiscordID del parámetro de la URL
        const url = new URL(req.url);
        const FID = url.searchParams.get('DiscordID');

        if (status && !status.claimedBy && FID) {
            // Si el nofy está disponible, intenta reclamarlo
            const claimResult = await claimNOF(FID);

            // Verificar si claimResult está definido
            if (claimResult) {
                // Regresar el resultado de la operación de reclamo
                return NextResponse.json({ 
                    status, 
                    claimResult,
                    message: claimResult.message
                }, { status: 200 });
            } else {
                // Si claimResult es undefined, devolver un mensaje de error
                return NextResponse.json({ message: 'Claim operation failed' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ 
                status, 
                message: 'Already claimed' 
            }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
