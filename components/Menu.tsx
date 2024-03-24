import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Menu = () => {
    return (
        <div tw="flex flex-col bg-slate-800 w-full h-full p-20">
            <h2>Menu</h2>
            <h3>General information</h3>
            <p>Nick: <b>mpefaur</b></p>
            <p>Discord ID: <b>433012300401301</b></p>
            <p>Collected nofys: <b>123</b> out of 132</p>
            <p>Progress: <b>93%</b></p>
            <p>Your position in the ranking: <b>5</b> out of <b>291</b> registered users.</p>
            <p>Total number of nofys collected by all users: <b>6279</b></p>
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
