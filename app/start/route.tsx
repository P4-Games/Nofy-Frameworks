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


  const response = await fetch(`${process.env.DOMAIN_URL}/api/status`, {
    method: "GET"
  });
  const res = await response.json();
  console.log(res);

  return {
    image: (
      <div tw="bg-white text-slate-800 text-base w-full px-12 h-full text-center justify-center items-center flex flex-col">
        <img src={res.status.image} alt="NOF" width={400} height={400} />
        <h3 className="text-slate-800 text-base">
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
      key={123}
      action="post"
      target={`${process.env.DOMAIN_URL}/collect`}
  >
      Collect
  </Button>,
  <Button
      key={124}
      action="post"
      target={`${process.env.DOMAIN_URL}/menu`}
  >
      Menu
  </Button>,
  <Button
      key={126}
      action="post"
      target={`${process.env.DOMAIN_URL}/rules`}
  >
      Rules
  </Button>,
  <Button
      key={125}
      action="post"
      target={`${process.env.DOMAIN_URL}/start`}
  >
      Refresh
  </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;