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


  return {

    image: 
    <div tw="flex flex-col text-base w-full h-full p-12 bg-white text-slate-800 ">
    <h1 tw="text-center justify-center">TOP 10 RANKING</h1>
    <p></p>
    <p>1.- {res[1]?.Nick} - Nofys Collected: {res[1]?.Characters}</p>
    <p>2.- {res[2]?.Nick} - Nofys Collected: {res[2]?.Characters}</p>
    <p>3.- {res[3]?.Nick} - Nofys Collected: {res[3]?.Characters}</p>
    <p>4.- {res[4]?.Nick} - Nofys Collected: {res[4]?.Characters}</p>
    <p>5.- {res[5]?.Nick} - Nofys Collected: {res[5]?.Characters}</p>
    <p>6.- {res[6]?.Nick} - Nofys Collected: {res[6]?.Characters}</p>
    <p>7.- {res[7]?.Nick} - Nofys Collected: {res[7]?.Characters}</p>
    <p>8.- {res[8]?.Nick} - Nofys Collected: {res[8]?.Characters}</p>
    <p>9.- {res[9]?.Nick} - Nofys Collected: {res[9]?.Characters}</p>
    <p>10.- {res[10]?.Nick} - Nofys Collected: {res[10]?.Characters}</p>
  </div>,

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