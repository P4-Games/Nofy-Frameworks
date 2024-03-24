export const getTimeLeft = async (): Promise<string> => {
    const URL = process.env.DOMAIN_URL + "/api/status";
    const res = await fetch(URL);
    const data = await res.json();

    return data?.message ?? "";
}