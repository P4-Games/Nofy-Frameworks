import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface InventoryProps {
    userData: any
}

export const Inventory = ({ userData }: InventoryProps) => {
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <h2 className="text-slate-800 font-lg"> 
            Inventory
            </h2>
                <img src={`${process.env.DOMAIN_URL}/api/inventory?discordId=${userData.discordID}`} alt="Image" width={450} height={450}/>
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
        Home
    </Button>,
];