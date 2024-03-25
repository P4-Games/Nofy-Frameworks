import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../utils/db'

// Función para obtener el inventario de characters de un usuario por su DiscordId
const getUsersInventory = async (discordId: string) => {
    try {
        // Conectar a la base de datos
        const db = await connectToDatabase()
        if (!db) throw new Error('No se pudo conectar a la base de datos')
    

        // Obtener las colecciones necesarias
        const usersCollection = db.collection('users')
        const charactersCollection = db.collection('characters')
        console.log(charactersCollection)

        // Buscar el usuario por su discordID
        const user = await usersCollection.findOne({ discordID: discordId })
        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        // Obtener los personajes del usuario y sus imágenes
        const characters = await charactersCollection
            .find({
                id: {
                    $in: user.characters.map((c) => c.id)
                }
            })
            .toArray()

        // Devolver el inventario de characters del usuario
        return characters
    } catch (error) {
        throw new Error('Error al obtener el inventario de characters: ' + error.message)
    }
}

// Controlador de la API
export async function GET(req: { url: string | URL }) {
    // Solo permitir el método GET

    try {
        const { searchParams } = new URL(req.url); // Obtener los parámetros de búsqueda de la URL
        const discordId = searchParams.get("discordId"); // Obtener el valor de discordId

        // Verificar si el DiscordId fue proporcionado
        if (!discordId) {
            throw new Error('Se requiere el DiscordId del usuario');
        }

        // Obtener el inventario de characters del usuario
        const userInventory = await getUsersInventory(discordId);

        // Enviar el inventario de characters como respuesta
        return NextResponse.json({
            characters: userInventory,
        }, {
            status: 200
        });
    } catch (error) {
        // Manejar los errores
        return NextResponse.json({
            message: error.message || 'Error del servidor'
        }, {
            status: error.status || 500
        });
    }
}

