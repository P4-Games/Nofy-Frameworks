import { getUserDataForFid } from "frames.js";

export const getClaimed = async (discordID: string): Promise<{ image: string, message: string }> => {
    // Asumiendo que necesitas obtener datos adicionales del usuario.
    const userData = await getUserDataForFid({ fid: parseInt(discordID) });

    // Construye la URL correctamente, usando `discordID`.
    const URL = `${process.env.DOMAIN_URL}/api/collect?discordId=${discordID}`;

    const res = await fetch(URL);
    const data = await res.json();

    // Devuelve la URL de la imagen y el mensaje desde la respuesta de la API.
    // Si no se encuentra la imagen o el mensaje, devuelve una cadena vacía.
    return {
        image: data.status?.image ?? "",
        message: data.message ?? ""
    };
}
