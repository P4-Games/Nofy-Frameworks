import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Menu = () => {
    return (
        <div tw="flex flex-col bg-slate-800 w-full h-full p-12 text-white gap-3">
            <h2 tw="my-3">General information</h2>
            <p tw="mt-12">Nick: mpefaur</p>
            <p tw="mt-6">Collected nofys: 118 out of 120</p>
            <p tw="mt-6">Progress: 93%</p>
            <p tw="mt-6">Your position in the ranking: 5 out of 291 registered users.</p>
            <p tw="mt-6">Total number of nofys collected by all users: 6279</p>
        </div>
    )
}

export const MenuButtons: AllowedButtonsArray = [
    <Button
        key={1}
        action="post"
        target={{
            query: { pageIndex: 5 },
        }}
    >
        Rank
    </Button>,
    <Button
        key={2}
        action="post"
        target={{
            query: { pageIndex: 6 },
        }}
    >
        Inventory
    </Button>,
    <Button
        key={3}
        action="post"
        target={{
            query: { pageIndex: 7 },
        }}
    >
        Missing
    </Button>,
    <Button
        key={4}
        action="post"
        target={{
            query: { pageIndex: 8 },
        }}
    >
        Mint
    </Button>,
];
