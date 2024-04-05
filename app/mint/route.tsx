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
        width: 500,
        height: 500,
      },
      buttons: [
        <Button
          key={0}
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
        <Button key={126} action="post" target={{ pathname: "/multipage", query: { pageIndex: 1 }, }}>
          Exit
        </Button>
      ],
    };
  }

  let image = (<div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
    {
      ctx.message?.inputText ? (
        <img src={`https://storage.googleapis.com/nof-gamma/T2/${ctx.message?.inputText}.png`} alt="NOFY" width={400} height={400} />
      ) : <img src={"https://storage.googleapis.com/nof-gamma/T2/inventory.png"} alt="NOFY" width={350} height={350} />
    }
    <h3 tw="text-slate-800 text-3xl">
      Select your NOFY
    </h3>
  </div>);

  let buttons = [];
  if (ctx.message?.inputText) {
    buttons.push(
      <Button key={123} action="tx" target={{ pathname: "/api/mint", query: { nofyId: ctx.message?.inputText.length > 0 ? ctx.message?.inputText : -1 } }} post_url="/mint">
        Mint
      </Button>
    );
  }
  buttons.push(
    <Button key={1234} action="post" target={{ pathname: "/mint" }}>
      Preview ID
    </Button>
  );
  buttons.push(
    <Button key={124} action="post" target={{ pathname: "/menu" }}>
      Menu
    </Button>
  );
  buttons.push(
    <Button key={126} action="post" target={{ pathname: "/start" }}>
      Home
    </Button>
  );

  return {
    image: image,
    imageOptions: {
      aspectRatio: "1:1",
      width: 500,
      height: 500,
    },
    buttons: buttons,
    textInput: "NOFY ID",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;