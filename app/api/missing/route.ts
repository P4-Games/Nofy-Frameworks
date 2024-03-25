import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/db';
import Jimp from 'jimp';
import { join } from 'path';

// Función para obtener los personajes faltantes en el inventario de un usuario por su DiscordId
const getUsersMissing = async (discordId) => {
    try {
        // Conectar a la base de datos
        const db = await connectToDatabase();
        if (!db) throw new Error('No se pudo conectar a la base de datos');
    
        // Obtener las colecciones necesarias
        const usersCollection = db.collection('users');
        const charactersCollection = db.collection('characters');

        // Buscar el usuario por su discordID
        const user = await usersCollection.findOne({ discordID: discordId });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Obtener los IDs de los personajes en el inventario del usuario
        const inventoryCharacterIds = user.characters.map(c => c.id);

        // Obtener los personajes que no están en el inventario del usuario
        const missingCharacters = await charactersCollection
            .find({
                id: { $nin: inventoryCharacterIds }
            })
            .toArray();

        // Devolver los personajes faltantes
        return missingCharacters;
    } catch (error) {
        throw new Error('Error al obtener los personajes faltantes: ' + error.message);
    }
}

// Controlador de la API
export async function GET(req) {
    // Solo permitir el método GET

    try {
        const { searchParams } = new URL(req.url); // Obtener los parámetros de búsqueda de la URL
        const discordId = searchParams.get("discordId"); // Obtener el valor de discordId

        // Verificar si el DiscordId fue proporcionado
        if (!discordId) {
            throw new Error('Se requiere el DiscordId del usuario');
        }

        // Obtener el inventario de characters del usuario
        const characters = await getUsersMissing(discordId);

        // Obtener las rutas de las imágenes locales redimensionadas de los personajes no presentes en el inventario
        const characterImagePaths = characters.map((c) =>
            join(process.cwd(), 'scripts', 'characters', `${c.id}.png`)
        )

        // Crear una matriz de promesas para cargar las imágenes
        const imagePromises = characterImagePaths.map(async (imagePath) => await Jimp.read(imagePath))

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

        for (let i = 0; i < images.length; i++) {
            if (images[i]) {
                collage.composite(images[i], currentX, currentY)

                // Actualizar las coordenadas para la siguiente imagen
                currentX += imageWidth
                if (currentX >= collageWidth) {
                    currentX = 0
                    currentY += imageHeight
                }
            }
        }

        // Obtener la imagen del collage como un buffer
        const collageBuffer = await collage.getBufferAsync(Jimp.MIME_PNG)

        // Enviar la imagen como respuesta
        return new Response(collageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png'
            }
        });
    } catch (error) {
        // Manejar los errores
        return new Response(JSON.stringify({
            message: error.message || 'Error del servidor'
        }), {
            status: error.status || 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

function getNumberOfColumns(imageCount) {
    if (imageCount <= 30) {
        return 12
    } else if (imageCount <= 60) {
        return 13
    } else if (imageCount <= 90) {
        return 14
    } else if (imageCount <= 120) {
        return 15
    } else {
        return 16
    }
}