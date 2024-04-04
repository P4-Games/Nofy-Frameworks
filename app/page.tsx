// ./app/page.tsx
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  console.log("Valor de process.env.DOMAIN_URL:", process.env.DOMAIN_URL); // Agregar un título al log
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL("/cover", process.env.DOMAIN_URL ? process.env.DOMAIN_URL : "https://nofy-frameworks-7bteynlhua-uc.a.run.app/")
    ),
  };
}

export default function Page() {
  return <span>My existing page</span>;
}
