/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx) => {
  console.log(`collect ${ctx.message?.requesterFid}`);
  const userId = ctx.message?.requesterFid;


  const response = await fetch(`${process.env.DOMAIN_URL}/api/collect?DiscordID=${userId}`, {
    method: "GET"
  });
  const res = await response.json();
  console.log(res);

  return {
    image: (
        <div tw="flex flex-col">
            <img src={process.env.DOMAIN_URL + "/nof1.png"} alt="Image" width={500} height={500} />
        </div>
    ),
    imageOptions: {
      aspectRatio: "1:1",
      width: "500",
      height: "500",
      
    },
    buttons: [
        <Button
        key={0}
        action="post"
        target={`${process.env.DOMAIN_URL}/start`}
    >
        Start
    </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;