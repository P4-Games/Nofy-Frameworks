import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Inventory = ()=>{
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <h2 className="text-slate-800 font-lg"> 
            Inventory
            </h2>
            <img src={"https://nof.town/api/characters?discordID=885536275908657162"} alt="Image" width={400} height={400} />
        </div>
    )
}

export const InventoryButtons: AllowedButtonsArray = [
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