/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Cover, CoverButtons } from "@/components/Cover";
import { Menu, MenuButtons } from "@/components/Menu";
import { Rules, RulesButtons } from "@/components/Rules";
import { Start, StartButtons } from "@/components/Start";
import { AllowedButtonsArray } from "@/types/frames";
import { getRandomCharacterID } from "@/utils/getCharacter";
import { getTimeLeft } from "@/utils/getTimeLeft";
import { createFrames, Button } from "frames.js/next";
import React, { ReactElement } from "react";
import { setInterval } from "timers/promises";

const totalPages = 5;

const frames = createFrames({
    basePath: "/multipage",
    initialState: {
        pageIndex: 0,
    },
});


interface DefaultFrameProps{
    imageUrl: string;
    pageIndex: number;
}
const DefaultFrame = ({imageUrl, pageIndex}: DefaultFrameProps)=>{

    return (
        <div tw="flex flex-col">
            <img width={300} height={200} src={imageUrl} alt="Image" />
            <div tw="flex">
                This is slide {pageIndex + 1} / {totalPages}
            </div>
        </div>
    )
}

const defaultButtons = (pageIndex: number): any[] => ([
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: (pageIndex - 1) % totalPages },
        }}
    >
        ←
    </Button>,
    <Button
        key={1}
        action="post"
        target={{
            query: { pageIndex: (pageIndex + 1) % totalPages },
        }}
    >
        →
    </Button>,
]);

const handleRequest = frames(async (ctx) => {
    const pageIndex = Number(ctx.searchParams.pageIndex || 0);

    const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

    const timeLeft = await getTimeLeft();
    const characterId = await getRandomCharacterID();

    const pages: { [key: number]: [React.ReactElement | string, AllowedButtonsArray] } = {
        0: [process.env.BASE_URL + "/nof.jpg", CoverButtons],
        1: [<Start characterId={characterId} timeLeft={timeLeft} key={0}/>, StartButtons],
        2: [<Rules key={1} />, RulesButtons],
        3: [<Menu key={2} />, MenuButtons]
    }
    
    return {
        image: pages[pageIndex]?.[0] ?? (
            <DefaultFrame imageUrl={imageUrl} pageIndex={pageIndex} />
        ),
        buttons:  pages[pageIndex]?.[1] ?? (
            defaultButtons(pageIndex)
        ),
    };
});

export const GET = handleRequest;
export const POST = handleRequest;