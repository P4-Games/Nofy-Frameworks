// ./app/page.tsx
import { fetchMetadata } from "frames.js/next";
 
export async function generateMetadata() {
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL("/multipage", process.env.BASE_URL ? process.env.BASE_URL : "http://localhost:3000")
    ),
  };
}
 
export default function Page() {
  return <span>My existing page</span>;
}