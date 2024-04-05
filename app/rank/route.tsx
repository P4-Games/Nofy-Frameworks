/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});


const handleRequest = frames(async () => {
  
  const response = await fetch(`${process.env.DOMAIN_URL}/api/rank`, {
    method: "GET"
  });
  const res = await response.json();
  console.log(res);

  // Generar el texto con los detalles de los usuarios
  let userListText = "\n";
  res?.usersRank.forEach((user:any, index:any) => {
    const position = index + 1;
    userListText += `${position}.- ${user.Nick} - Nofys Collected: ${user.Characters}\n`;
  });

  return {
    image: 
    <div tw="flex flex-col text-base w-full h-full p-12 bg-white text-slate-800 ">
    <h2 tw="text-center justify-center">TOP 10 RANKING</h2>
    <pre tw="white-space-pre-line">{userListText}</pre>
    </div>
    ,
    imageOptions: {
      aspectRatio: "1:1",
      width: 500,
      height: 500,
    },
    buttons: [
     
  <Button
      key={3}
      action="post"
      target={`${process.env.DOMAIN_URL}/menu`}
  >
      Menu
  </Button>,
  <Button
      key={4}
      action="post"
      target={`${process.env.DOMAIN_URL}/start`}
  >
      Home
  </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;