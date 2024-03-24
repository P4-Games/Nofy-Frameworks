import { getUserDataForFid } from "frames.js";

export const createUser = async (fid: string) => {
    const userData = await getUserDataForFid({ fid: parseInt(fid) });

    const URL = process.env.BASE_URL + "/api/start";

    const res = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
            nick: userData?.username,
            discordID: fid
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();

    return data;
}