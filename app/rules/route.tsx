/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx: any) => {
  const texts = [
    "A new Nofy will be available every 5min.",
    "The first user to collect gets the character.",
    "Check your inventory.",
    "You can only collect a Nofy if you are the first to collect.",
    "If you already have a Nofy in your inventory you will not be able to collect it.",
    "Collect all of them.",
    "Only then can you choose the one you like best and mint your NFT.",
    "Once you have mined your NFT your inventory will be reset and you will be able to replay the game.",
    "Enjoy the adventure and become the Number One Fan!",]

  return {
    image: (
        <div tw="flex flex-col text-sm	bg-white text-slate-800 w-full h-full p-12 ">
            <h1 tw="text-center justify-center" >RULES</h1>
            {texts.map((text, index) => {
                return (
                    <p key={index} >
                        • {text}
                    </p>
                )
            })}
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
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;