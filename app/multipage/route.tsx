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
import { createUser } from "@/utils/createUser";
import { getRandomCharacterID } from "@/utils/getCharacter";
import { getTimeLeft } from "@/utils/getTimeLeft";
import { farcasterHubContext, openframes } from "frames.js/middleware";
import { createFrames, Button } from "frames.js/next";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";
import React, { ReactElement } from "react";
import { setInterval } from "timers/promises";

const totalPages = 5;

const frames = createFrames({
    basePath: "/multipage",
    initialState: {
        pageIndex: 0,
    },
    middleware: [
        farcasterHubContext(),
        openframes({
            clientProtocol: {
                id: "xmtp",
                version: "2024-02-09",
            },
            handler: {
                isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
                getFrameMessage: async (body: JSON) => {
                    if (!isXmtpFrameActionPayload(body)) {
                        return undefined;
                    }
                    const result = await getXmtpFrameMessage(body);

                    return { ...result };
                },
            },
        }),
    ],
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

const dataRequests = async (pageIndex: number, fid: string) => {
    let data: {
        [key: string]: string | null
    } = {
        timeLeft: null,
        characterId: null,
        userData: null
    };

    if(pageIndex === 2 || pageIndex === 1){
        data.timeLeft = await getTimeLeft();
    }

    if(pageIndex === 1){
        data.characterId = await getRandomCharacterID();
        data.userData = await createUser(fid);
    }

    return data;
}

const handleRequest = frames(async (ctx) => {
    const pageIndex = Number(ctx.searchParams.pageIndex || 0);

    const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

    const fid = ctx.message?.requesterFid;
    const inputText = ctx.message?.inputText;

    const { timeLeft, characterId, userData } = await dataRequests(pageIndex, (fid ?? -1)?.toString());
    
    console.log(fid, inputText);

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