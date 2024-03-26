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

        // Calcular el layout del collage para mantener la relación de aspecto de 1.91:1
        const { numColumns, numRows } = calculateLayout(images.length, images[0].bitmap.width, images[0].bitmap.height, 1.91);
        const collageWidth = numColumns * images[0].bitmap.width;
        const collageHeight = numRows * images[0].bitmap.height;

        // Crear un lienzo para el collage
        const collage = new Jimp(collageWidth, collageHeight);

        // Colocar las imágenes en el collage
        let currentX = 0;
        let currentY = 0;

        images.forEach((image, i) => {
            collage.composite(image, currentX, currentY);

            // Actualizar las coordenadas para la siguiente imagen
            currentX += image.bitmap.width;
            if (currentX >= collageWidth) {
                currentX = 0;
                currentY += image.bitmap.height;
            }
        });
        // Escalar la imagen a la mitad de su tamaño original
        collage.resize(600, 320); // Ajustar a la mitad de 1200x640
        
        // Obtener la imagen del collage como un buffer en formato JPG
        const collageBuffer = await collage.getBufferAsync(Jimp.MIME_GIF);

        // Enviar la imagen como respuesta en formato JPG
        return new Response(collageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif'
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

// Nueva función para calcular el layout del collage
function calculateLayout(imageCount, imageWidth, imageHeight, aspectRatio) {
    let numColumns = Math.ceil(Math.sqrt(imageCount * aspectRatio));
    let numRows = Math.ceil(imageCount / numColumns);

    while ((numColumns * imageWidth) / (numRows * imageHeight) > aspectRatio) {
        numColumns--;
        numRows = Math.ceil(imageCount / numColumns);
    }

    return { numColumns, numRows };
}