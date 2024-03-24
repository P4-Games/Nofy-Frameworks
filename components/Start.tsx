import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface StartProps {
    timeLeft: string;
    characterId: string;
}
//<img src={"https://nof.town/api/characters?discordID=885536275908657162"} alt="Image" width={400} height={400} />
export const Start = ({ timeLeft, characterId }: StartProps) => {
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <img src={`${process.env.BASE_URL}/scripts/characters/${characterId}.png`} alt="NOF" width={200} height={200} />
            <h3 className="text-slate-800 font-lg">  
                {timeLeft ?? ""}
            </h3>
        </div>
    )
}

export const StartButtons: AllowedButtonsArray = [
    <Button
        key={123}
        action="post"
        target={{
            query: { pageIndex: 4 },
        }}
    >
        Collect
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
            query: { pageIndex: 2 },
        }}
    >
        Rules
    </Button>,
    <Button
        key={125}
        action="post"
        target={{
            query: { pageIndex: 1 },
        }}
    >
        Refresh
    </Button>,
];