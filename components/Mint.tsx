import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"
import { FrameInput } from "frames.js/next/server";

export const Mint = () => {
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <h3 className="text-slate-800 font-lg">  
                Select your NOFY
            </h3>
            <img src={"https://nof.town/api/characters?discordID=885536275908657162"} alt="Image" width={400} height={400} />
            <FrameInput text="Mint id" />
        </div>
    )
}

export const MintButtons: AllowedButtonsArray = [
    <Button
        key={123}
        action="post"
        target={{
            query: { pageIndex: 4 },
        }}
    >
        Mint
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
        Home
    </Button>,
];