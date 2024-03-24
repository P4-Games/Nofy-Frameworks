import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface StartProps {
    timeLeft: string;
}
export const Start = async ({ timeLeft }: StartProps) => {
    return (
        <div className="flex flex-col">
            {/*<img src={"https://nof.town/api/characters?discordID=885536275908657162"} alt="Image" width={1080} height={566} />*/}
            <h3 className="text-white font-lg">  
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
            query: { pageIndex: 2 },
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
        key={125}
        action="post"
        target={{
            query: { pageIndex: 4 },
        }}
    >
        Refresh
    </Button>,
];