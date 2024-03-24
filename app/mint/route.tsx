/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx) => {
  if (ctx.message?.transactionId) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          key={0}
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
        <h3 className="text-slate-800 font-lg">
          Select your NOFY
        </h3>
        {
          ctx.searchParams?.pageIndex === "2" && ctx.message?.inputText ? (
            <img src={`${process.env.BASE_URL}/scripts/characters/${ctx.message?.inputText}.png`} alt="NOFY" width={200} height={200} />
          ) : <img src={"https://nof.town/api/characters?discordID=885536275908657162"} alt="NOFY" width={400} height={400} />
        }
      </div>
    ),
    imageOptions: {
      aspectRatio: "1:1",
    },
    buttons: [
      <Button 
        key={123}
        action="tx" 
        target="/api/mint" 
        post_url="/mint"
      >
        Mint
      </Button>,
      <Button 
        key={1234}
        action="post" 
        target={{ 
          pathname: "/mint",
          query: { pageIndex: 2 } 
        }}
      >
        Preview ID
      </Button>,
      <Button
        key={124}
        action="post"
        target={{
          query: { pageIndex: 3 },
        }}
      >
        Menu
      </Button>,
      <Button
        key={126}
        action="post"
        target={{
          query: { pageIndex: 1 },
        }}
      >
        Exit
      </Button>,
    ],
    textInput: "NOFY ID",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;