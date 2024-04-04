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


  const response = await fetch(`${process.env.DOMAIN_URL}/api/info?discordId=${userId}`, {
    method: "GET"
  });
  const res = await response.json();
  console.log(res);

  return {
    image: (
      <div tw="flex flex-col text-base	bg-slate-800 w-full h-full p-12 text-white ">
      <h1>General information</h1>
      <p>Nick: {res?.nick}</p>
      <p>Collected nofys: {res?.charactersInInventory ?? ""} out of 120</p>
      <p>Progress: {res?.inventoryCompletion ?? "0%"}</p>
      <p>Your position in the ranking: {res?.ranking} out of {res?.usersRegistered} registered users.</p>
      <p>Total number of NOFYs collected by all users: {res?.charactersCaptured}</p>
  </div>
    ),
    imageOptions: {
      aspectRatio: "1:1",
      width: "500",
      height: "500",
    },
    buttons: [
      <Button
      key={1}
      action="post"
      target={{
          query: { pageIndex: 5 },
      }}
  >
      Rank
  </Button>,
  <Button
      key={2}
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
  <Button
      key={4}
      action="post"
      target={`${process.env.DOMAIN_URL}/mint`}
  >
      Mint
  </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;