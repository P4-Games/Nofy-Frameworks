import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface MenuProps {
    userData: any
}
export const Ranking = ({ userData }: MenuProps) => {
    return (
        <div tw="flex flex-col bg-slate-800 w-full h-full p-12 text-white gap-3">
            <h2>Ranking</h2>
            <p tw="mt-6">Your position in the ranking: {userData?.ranking} out of {userData?.usersRegistered} registered users.</p>
            <p tw="mt-6">Total number of NOFYs collected by all users: {userData?.charactersCaptured}</p>
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