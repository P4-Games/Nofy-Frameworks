import { ObjectId } from 'mongodb';
import { CHANNEL_ID } from "@/constants/db";
import { storageUrlGamma } from "@/utils/config";
import { connectToDatabase } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getFrameMessage } from 'frames.js';

interface ClaimData {
    initial_date: Date;
    time: number;
    window: number;
}

function calculateNextClaim(prizeData: ClaimData): boolean | string {
    const { initial_date, time, window } = prizeData;
    const currentDate = new Date();
    const elapsedTime = currentDate.getTime() - initial_date.getTime();
    const elapsedMinutes = elapsedTime / (1000 * 60);

    // Calcular el número de intervalos de tiempo completados
    const completedIntervals = Math.floor(elapsedMinutes / time);

    // Calcular el próximo tiempo de reclamo
    const nextClaimTime = new Date(initial_date.getTime() + (completedIntervals + 1) * time * 60 * 1000);

    // Verificar si el próximo reclamo está dentro de la ventana de tiempo  windowEndTime = nextClaim + window
    const windowEndTime = new Date(nextClaimTime.getTime() + window * 60 * 1000);

    console.log(nextClaimTime, windowEndTime, currentDate);
    
    if (nextClaimTime <= currentDate && currentDate <= windowEndTime) {
        return true;
    } else {
        const remainingTime = nextClaimTime.getTime() - currentDate.getTime();
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        let dateString = "";

        if(hours > 0) dateString += `${hours} hour${hours > 1 ? "s" : ""} `;
        if(minutes > 0) dateString += `${minutes} minute${minutes > 1 ? "s" : ""} `;
        if(seconds > 0) dateString += `${seconds} second${seconds > 1 ? "s" : ""}`;

        return `${dateString}`;
    }
}

const claimData: ClaimData = {
    initial_date: new Date("2024-03-19T20:29:08+00:00"),
    time: 15,
    window: 15
};


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

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const status = await getCharacterStatus();
        console.log(status)
        return NextResponse.json({ status, message: status?.claimedBy ? `Nofy collected, please wait ${status.remainingTime} mins` : "Nofy available, select colect to claim it!" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
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

        const serverDate = new Date(server.generatedDate);
        const currentDate = new Date();
        const elapsedTime = currentDate.getTime() - serverDate.getTime();
        const elapsedMinutes = elapsedTime / (1000 * 60);

        if (elapsedMinutes > 15) {
            return {
                message: `This N expired, please wait ${15 - elapsedMinutes} mins`
            }
        }

        const characterID = server.nofy;

        const userCollection = db.collection('users')
        const user = await userCollection.findOne({
            discordID: FID
        })

        if(!user) {
            return {
                message: 'User not found'
            }
        }

        const character = user.characters.find((c: any) => c.id.toString() === characterID.toString());

        if (character) {
            return {
                message: 'Character already claimed'
            }
        }

        await serversCollection.updateOne(
            { _id: new ObjectId("65d0f080707968958eeeaecc") },
            {
                $set: {
                    claimedBy: FID,
                }
            }
        )

        return {
            message: 'Character claimed successfully',
        }
    } catch (error) {
        console.log(error)
        return {
            message: 'Server error'
        }
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const request = await req.json();
        const res = await claimNOF(request.uid);
        console.log(res)
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Server error'
        }, {
            status: 500
        })
    }
}