import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../utils/db'

// Función para obtener el ranking de los usuarios
const getUsersRank = async () => {
    // Conectar a la base de datos
    const db = await connectToDatabase()
    if(!db) return;
    const usersCollection = db.collection('users')

    // Obtener todos los usuarios
    const userRanking = await usersCollection.find().toArray()
    console.log(userRanking)

    // Limitar el ranking a los primeros 10 jugadores
    const limitedRanking = userRanking.slice(0, 10)
    console.log(limitedRanking)

    // Crear el objeto de ranking con la posición como clave
    const rankingByPosition: Record<string, any> = {};
    limitedRanking.forEach((user, index) => {
        rankingByPosition[(index + 1).toString()] = {
            Nick: user.nick,
            Characters: user.characters.length,
        };
    });

    return rankingByPosition;
}

// Controlador de la API
export async function GET(req: NextRequest, res: NextResponse) {
    // Solo permitir el método GET

    try {
        // Obtener el ranking de los usuarios
        const usersRank = await getUsersRank()

        // Enviar el ranking de los usuarios como respuesta
        return NextResponse.json({
            usersRank,
        }, {
            status: 200
        })
    } catch (error) {
        // Manejar los errores
        return NextResponse.json({
            message: 'Server error'
        }, {
            status: 500
        })
    }
}
