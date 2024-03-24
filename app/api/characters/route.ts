import { v4 as uuidv4 } from 'uuid'
import { connectToDatabase } from '../../../utils/db'
import { join } from 'path'
import Jimp from 'jimp'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
    const request = await req.json();
    const discordID = request.uid;

    if (!discordID) {
        return NextResponse.json({
            error: 'Discord ID is missing from query parameters.'
        })
    }

    try {
        const db = await connectToDatabase()
        if(!db) return NextResponse.json({ error: 'Database connection failed.' }, { status: 500})
        const usersCollection = db.collection('users')
        const charactersCollection = db.collection('characters')

        // Buscar el usuario por su discordID
        const user = await usersCollection.findOne({
            discordID
        })
        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404})
        }

        // Obtener los personajes del usuario y sus imágenes
        const characters = await charactersCollection
        .find({
            id: {
            $in: user.characters.map((c: any) => c.id)
            }
        })
        .toArray()

        // Obtener las rutas de las imágenes locales redimensionadas
        const characterImagePaths = characters.map((c: any) =>
            join(process.cwd(), 'scripts', 'characters', `${c.id}.png`)
        )

        // Crear una matriz de promesas para cargar las imágenes
        const imagePromises = characterImagePaths.map(async (imagePath: any) => await Jimp.read(imagePath))

        const images = await Promise.all(imagePromises)

        // Calcular el tamaño del lienzo del collage
        const maxImagesPerRow = getNumberOfColumns(images.length)
        const maxImagesPerColumn = Math.ceil(images.length / maxImagesPerRow)
        const imageWidth = images[0].bitmap.width
        const imageHeight = images[0].bitmap.height

        const collageWidth = maxImagesPerRow * imageWidth
        const collageHeight = maxImagesPerColumn * imageHeight

        // Crear un lienzo para el collage
        const collage = new Jimp(collageWidth, collageHeight)

        // Colocar las imágenes en el collage
        let currentX = 0
        let currentY = 0

        for (const element of images) {
        if (element) {
            collage.composite(element, currentX, currentY)

            // Actualizar las coordenadas para la siguiente imagen
            currentX += imageWidth
            currentY += imageHeight
        }
        }

        console.log('Collage created', currentX, currentY)

        // Obtener la imagen del collage como un buffer
        const collageBuffer = await collage.getBufferAsync(Jimp.MIME_PNG)

        // Generar una cadena de consulta única
        const query = uuidv4()

        // Agregar la cadena de consulta única a la URL de la imagen
        const imageUrlWithQuery = `https://nof.town/api/characters?discordID=${discordID}`

        const img = await fetch(`https://nof.town/api/characters?discordID=${discordID}`)
            .then(res => res.blob())

            // Enviar la imagen como respuesta
        //return res.status(200).send(collageBuffer)
        return NextResponse.json(img, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Location': imageUrlWithQuery
            }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: 'An error occurred while processing your request.'
        }, {
            status: 500
        })
    }
}

function getNumberOfColumns(imageCount: number) {
  if (imageCount <= 30) {
    return 6
  } else if (imageCount <= 60) {
    return 7
  } else if (imageCount <= 90) {
    return 8
  } else if (imageCount <= 120) {
    return 10
  } else {
    return 11
  }
}
