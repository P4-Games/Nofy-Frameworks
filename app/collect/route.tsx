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


  const response = await fetch(`${process.env.DOMAIN_URL}/api/collect?DiscordID=${userId}`, {
    method: "GET"
  });
  const res = await response.json();
  console.log(res);

  return {
    image: (
      <div tw="bg-white text-slate-800 text-base w-full px-12 h-full text-center justify-center items-center flex flex-col">
        <img src={res.status.image} alt="NOF" width={400} height={400} />
        <h3 className="text-slate-800 text-base font-lg">
          {res.message}
        </h3>
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
      <Button
        key={3}
        action="post"
        target={`${process.env.DOMAIN_URL}/missing`}
      >
        Missing
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;