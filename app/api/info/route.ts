import { connectToDatabase } from '../../../utils/db';
import {NextRequest, NextResponse} from "next/server";

/**
 * Obtiene la información de un usuario.
 * @param {Object} db - Conexión a la base de datos.
 * @param {string} discordID - ID de Discord del usuario.
 * @returns {Object} - Información del usuario.
 * @throws {Error} - Si no se encuentra al usuario en la base de datos.
 */
const getUserInfo = async (db: any, discordID: any) => {
  // Obtener la colección de usuarios
  const usersCollection = db.collection('users')

  // Buscar al usuario por su ID de Discord
  const user = await usersCollection.findOne({
    discordID
  })

  // Lanzar un error si el usuario no existe
  if (!user) {
    throw new Error(`User not found for discordID: ${discordID}`)
  }

  // Calcular la cantidad de personajes del usuario
  const charactersCount = user.characters.length

  // Calcular el porcentaje de completitud del inventario del usuario
  const inventoryCompletion = Math.floor((charactersCount / 132) * 100)

  // Obtener la cantidad total de usuarios registrados
  const usersCount = await usersCollection.countDocuments()

  // Obtener la cantidad total de personajes capturados por todos los usuarios
  const charactersCaptured = await usersCollection
    .aggregate([
      { $project: { _id: 0, characters: 1 } },
      { $unwind: '$characters' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ])
    .toArray()

  // Obtener el ranking de usuarios y ordenarlo
  const userRanking = await usersCollection.find().toArray()
  const sortedRanking = calculateRank(userRanking)

  // Obtener la posición del usuario en el ranking
  const userPosition = sortedRanking.findIndex((item: any) => item.nick === user.nick) + 1

  // Construir y retornar el objeto de información del usuario
  return {
    Nick: user.nick,
    DiscordID: user.discordID,
    CharactersInInventory: charactersCount,
    InventoryCompletion: inventoryCompletion,
    UsersRegistered: usersCount,
    CharactersCaptured: charactersCaptured[0].count,
    Ranking: userPosition
  }
}

/**
 * Calcula el ranking de usuarios.
 * @param {Array} users - Lista de usuarios.
 * @returns {Array} - Ranking de usuarios ordenado.
 */
const calculateRank = (users: any) =>
  users.sort((a: any, b: any) => {
    // Obtener el rango de medallas de los usuarios
    const aMedalRank = calculateMedalRank(a.medals)
    const bMedalRank = calculateMedalRank(b.medals)

    // Comparar los rangos de medallas
    if (aMedalRank > bMedalRank) {
      return -1
    } else if (aMedalRank < bMedalRank) {
      return 1
    } else {
      // Si los rangos de medallas son iguales, comparar la cantidad de personajes
      return compareCharacters(a, b)
    }
  })

/**
 * Calcula el rango de medallas de un usuario.
 * @param {Array} medals - Lista de medallas del usuario.
 * @returns {number} - Rango de medallas.
 */
const calculateMedalRank = (medals: any) => {
  // Calcular la cantidad total de medallas sumando los puntos de cada tipo de medalla
  const goldMedals = countMedals(medals, 'gold')
  const silverMedals = countMedals(medals, 'silver')
  const bronzeMedals = countMedals(medals, 'bronze')

  return goldMedals * 3 + silverMedals * 2 + bronzeMedals
}

/**
 * Cuenta la cantidad de medallas de un tipo específico.
 * @param {Array} medals - Lista de medallas.
 * @param {string} medalType - Tipo de medalla.
 * @returns {number} - Cantidad de medallas del tipo especificado.
 */
const countMedals = (medals: any, medalType: any) => medals.filter((medal: any) => medal === medalType).length

/**
 * Compara la cantidad de personajes entre dos usuarios.
 * @param {Object} a - Primer usuario.
 * @param {Object} b - Segundo usuario.
 * @returns {number} - Resultado de la comparación.
 */
const compareCharacters = (a: any, b: any) => {
  if (a.characters.length > b.characters.length) {
    return -1
  } else if (a.characters.length < b.characters.length) {
    return 1
  } else {
    return 0
  }
}

/**
 * Manejador de la solicitud GET.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Respuesta JSON.
 */
export async function POST (req: NextRequest, res: NextResponse) {
  // Verificar el método de la solicitud
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' })
  }

  try {
    // Get the Discord ID of the user from the query
    const body = await req.json();
    const uid = body.uid;

    // Conectar a la base de datos
    const db = await connectToDatabase()

    // Obtener la información del usuario
    const userInfo = await getUserInfo(db, uid)

    // Responder con la información del usuario
    return NextResponse.json(userInfo)
  } catch (error) {
    // Manejar los diferentes tipos de errores
    if ((error as Error).message.startsWith('User not found')) {
        return NextResponse.json({ message: (error as Error).message })
    } else {
        return NextResponse.json({ message: 'Server error' })
    }
  }
}
