/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Collect, CollectButtons } from "@/components/Collect";
import { Cover, CoverButtons } from "@/components/Cover";
import { Inventory, InventoryButtons } from "@/components/Inventory";
import { Menu, MenuButtons } from "@/components/Menu";
import { Mint, MintButtons } from "@/components/Mint";
import { Missing, MissingButtons } from "@/components/Missing";
import { Ranking, RankingButtons } from "@/components/Ranking";
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

const dataRequests = async (pageIndex: number) => {
    let data: {
        [key: string]: string | null
    } = {
        timeLeft: null,
        characterId: null
    };

    if(pageIndex === 2 || pageIndex === 1){
        data.timeLeft = await getTimeLeft();
    }

    if(pageIndex === 1){
        data.characterId = await getRandomCharacterID();
    }

    return data;
}

const handleRequest = frames(async (ctx) => {
    const pageIndex = Number(ctx.searchParams.pageIndex || 0);

    const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

    const { timeLeft, characterId } = await dataRequests(pageIndex);

    const pages: { [key: number]: [React.ReactElement | string, AllowedButtonsArray, string | null ] } = {
        0: [process.env.BASE_URL + "/nof.jpg", CoverButtons, null],
        1: [<Start characterId={characterId ?? ""} timeLeft={timeLeft ?? ""} key={0}/>, StartButtons, null],
        2: [<Rules key={1} />, RulesButtons, null],
        3: [<Menu key={2} />, MenuButtons, null],
        4: [<Collect characterId={characterId ?? ""} key={3} />, CollectButtons, null],
        5: [<Ranking key={4} />, RankingButtons, null],
        6: [<Inventory key={5} />, InventoryButtons, null],
        7: [<Missing key={6} />, MissingButtons, null],
        8: [<Mint key={7} />, MintButtons, "NOFY id"]
    }
    
    return {
        image: pages[pageIndex]?.[0] ?? (
            <DefaultFrame imageUrl={imageUrl} pageIndex={pageIndex} />
        ),
        buttons:  pages[pageIndex]?.[1] ?? (
            defaultButtons(pageIndex)
        ),
        textInput: pages[pageIndex]?.[2] ?? undefined
    };
});

export const GET = handleRequest;
export const POST = handleRequest;