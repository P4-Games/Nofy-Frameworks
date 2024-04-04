import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/db';
import Jimp from 'jimp';
import { join } from 'path';

// Función para obtener los personajes faltantes en el inventario de un usuario por su DiscordId
const getUsersInventory = async (discordId: string) => {
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
        const inventoryCharacterIds = user.characters.map((c: { id: string }) => c.id);


        // Obtener los personajes que sí están en el inventario del usuario
        const existingCharacters = await charactersCollection
            .find({
                id: { $in: inventoryCharacterIds }
            })
            .toArray();
        
        console.log(existingCharacters);
        // Devolver los personajes existentes
        return existingCharacters;
    } catch (error) {
        if (error instanceof Error && typeof error.message === 'string') {
            throw new Error('Error al obtener los personajes existentes: ' + error.message);
        } else {
            throw new Error('Error al obtener los personajes existentes');
        }
    }
}

// Función para calcular el layout del collage
function calculateLayout(imageCount: number, imageWidth: number, imageHeight: number, aspectRatio: number) {
    let numColumns = Math.ceil(Math.sqrt(imageCount * aspectRatio));
    let numRows = Math.ceil(imageCount / numColumns);

    while ((numColumns * imageWidth) / (numRows * imageHeight) > aspectRatio) {
        numColumns--;
        numRows = Math.ceil(imageCount / numColumns);
    }

    return { numColumns, numRows };
}

// Controlador de la API
export async function GET(req: NextRequest) {
    // Solo permitir el método GET

    try {
        const { searchParams } = new URL(req.url); // Obtener los parámetros de búsqueda de la URL
        const discordId = searchParams.get("discordId"); // Obtener el valor de discordId

        // Verificar si el DiscordId fue proporcionado
        if (!discordId) {
            throw new Error('Se requiere el DiscordId del usuario');
        }

        // Obtener el inventario de characters del usuario
        const characters = await getUsersInventory(discordId);

        // Inicializar characterImagePaths
        let characterImagePaths = [];

        // Verificar si el array de characters está vacío
        if (characters.length === 0) {
            // Si está vacío, añadir la ruta de la imagen nofy.png
            characterImagePaths.push(join(process.cwd(), 'public', 'nofy.png'));
        } else {
            // Si no está vacío, obtener las rutas de las imágenes locales redimensionadas de los personajes no presentes en el inventario
            characterImagePaths = characters.map((c) =>
                join(process.cwd(), 'scripts', 'characters', `${c.id}.png`)
            );
        }

        // Crear una matriz de promesas para cargar las imágenes
        const imagePromises = characterImagePaths.map(async (imagePath) => await Jimp.read(imagePath));
        const images = await Promise.all(imagePromises);

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
        collage.resize(600, 600); // Ajustar a la mitad de 1200x640
        
        // Obtener la imagen del collage como un buffer en formato PNG
        const collageBuffer = await collage.getBufferAsync(Jimp.MIME_PNG);

        // Enviar la imagen como respuesta en formato PNG
        return new Response(collageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png'
            }
        });

    } catch (error) {
        if (error instanceof Error && typeof error.message === 'string') {
            return new Response(JSON.stringify({
                message: error.message || 'Error del servidor'
            }), {
                status: 500, // Aquí establecemos el código de estado a 500
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({
                message: 'Error del servidor'
            }), {
                status: 500, // Aquí establecemos el código de estado a 500
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
}
