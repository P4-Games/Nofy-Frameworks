import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Ranking = ()=>{
    return (
        <div tw="flex flex-col bg-slate-800 w-full h-full p-12 text-white gap-3">
            <h2>Ranking</h2>
            <p>Your position in the ranking: 5 out of 291 registered users.</p>
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