import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface MenuProps {
    userData: any
}
export const Menu = ({ userData }: MenuProps) => {
    console.log(userData)
    return (
        <div tw="flex flex-col bg-slate-800 w-full h-full p-12 text-white gap-3">
            <h2 tw="my-3">General information</h2>
            <p tw="mt-12">Nick: {userData?.nick}</p>
            <p tw="mt-6">Collected nofys: {userData?.charactersInInventory ?? ""} out of 120</p>
            <p tw="mt-6">Progress: {userData?.inventoryCompletion ?? "0%"}</p>
            <p tw="mt-6">Your position in the ranking: {userData?.ranking} out of {userData?.usersRegistered} registered users.</p>
            <p tw="mt-6">Total number of NOFYs collected by all users: {userData?.charactersCaptured}</p>
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
        target={`${process.env.DOMAIN_URL}/inventory`}
    >
        Inventory
    </Button>,
    <Button
        key={3}
        action="post"
        target={`${process.env.DOMAIN_URL}/missing`}
    >
        Missing
    </Button>,
    <Button
        key={4}
        action="post"
        target={`${process.env.DOMAIN_URL}/mint`}
    >
        Mint
    </Button>,
];
