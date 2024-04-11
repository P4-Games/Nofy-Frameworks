/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx: any) => {
  console.log(`collect ${ctx.message?.requesterFid}`);
  const userId = ctx.message?.requesterFid;


  return {
    image: (
      <div tw="bg-white text-slate-800 text-xl	w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <h2 > 
            Missing
            </h2>
        <img src={`${process.env.DOMAIN_URL}/api/missing?discordId=${userId}`} alt="Image" width={400} height={350}/>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1:1",
      width: 500,
      height: 500,
    },
    buttons: [
      <Button
        key={0}
        action="post"
        target={`${process.env.DOMAIN_URL}/start`}
      >
        Back
      </Button>,

      <Button
        key={1}
        action="post"
        target={`${process.env.DOMAIN_URL}/inventory`}
      >
        Inventory
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;