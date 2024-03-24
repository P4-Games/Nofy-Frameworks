import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Ranking = ()=>{
    return (
        <div tw="flex flex-col">
            <h2>Ranking</h2>

        </div>
    )
}

export const RankingButtons: AllowedButtonsArray = [
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