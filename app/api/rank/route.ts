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

    // Ordenar los usuarios por rango de medallas y número de personajes
    const sortedRanking = userRanking.sort((a: any, b: any) => {
        // Calcular el rango de medallas para cada usuario
        const aMedalRank = calculateMedalRank(a.medals)
        const bMedalRank = calculateMedalRank(b.medals)

        // Comparar el rango de medallas de los usuarios
        if (aMedalRank > bMedalRank) {
            return -1
        } else if (aMedalRank < bMedalRank) {
            return 1
        } else {
            // Si los usuarios tienen el mismo rango de medallas, comparar por cantidad de personajes
            if (a.characters.length > b.characters.length) {
                return -1
            } else if (a.characters.length < b.characters.length) {
                return 1
            } else {
                return 0 // Los usuarios son iguales en rango de medallas y cantidad de personajes
            }
        }
    })

    // Limitar el ranking a los primeros 10 jugadores
    const limitedRanking = sortedRanking.slice(0, 10)

    // Crear la lista de ranking con la posición, el nombre, la cantidad de personajes y las medallas
    const rankingList = limitedRanking.map((user: any, index: any) => ({
        Position: index + 1,
        Nick: user.nick,
        Characters: user.characters.length,
        Medals: user.medals
    }))

    return rankingList
}

// Función para calcular el rango de medallas de un usuario
const calculateMedalRank = (medals: any) => {
    let medalRank = 0

    // Sumar los rangos de todas las medallas del usuario
    medalRank += countMedals(medals, 'gold') * 3 // Cada medalla de oro vale 3 puntos
    medalRank += countMedals(medals, 'silver') * 2 // Cada medalla de plata vale 2 puntos
    medalRank += countMedals(medals, 'bronze') * 1 // Cada medalla de bronce vale 1 punto

    return medalRank
}

// Función para contar la cantidad de un tipo de medalla específico
const countMedals = (medals: any, medalType: any) => medals.filter((medal: any) => medal === medalType).length

// Controlador de la API
export default async function GET(req: NextRequest, res: NextResponse) {
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
