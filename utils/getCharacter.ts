export const getRandomCharacterID = async (): Promise<string> => {
    const URL = process.env.DOMAIN_URL + "/api/newCharacter";

    const res = await fetch(URL);
    const data = await res.json();

    return data?.characterID ?? "";
}