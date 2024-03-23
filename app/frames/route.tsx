/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import React from "react";

const frames = createFrames();
const handleRequest = frames(async (ctx) => {
    return {
        image: "http://localhost:3000/background.png", /*(
            <span>
                {ctx.pressedButton
                    ? `I clicked ${ctx.searchParams.value}`
                    : `Click some button`}
            </span>
        ),*/
        buttons: [
            <Button key={0} action="post" target={{ query: { value: "Yes" } }}>
                Iniciar
            </Button>,
            /*<Button key={1} action="post" target={{ query: { value: "No" } }}>
                Say No
            </Button>,*/
        ],
    };
});

export const GET = handleRequest;
export const POST = handleRequest;