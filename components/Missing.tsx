import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Cover = ()=>{
    return (
        <div tw="flex flex-col">
            <img src={"https://nof.town/api/missing?discordID=885536275908657162"} alt="Image" width={400} height={400} />
        </div>
    )
}

export const CoverButtons: AllowedButtonsArray = [
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: 1 },
        }}
    >
        Start
    </Button>,
];