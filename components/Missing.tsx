import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Missing = ()=>{
    return (
        <div tw="flex flex-col">
            <img src={"https://nof.town/api/characters?discordID=885536275908657162"} alt="Image" width={400} height={400} />
        </div>
    )
}

export const MissingButtons: AllowedButtonsArray = [
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: 3 },
        }}
    >
        Menu
    </Button>,
    <Button
        key={1}
        action="post"
        target={{
            query: { pageIndex: 1 },
        }}
    >
        Exit
    </Button>,
];