import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface CollectProps {
    characterId: string;
}

export const Collect = ({ characterId }: CollectProps) => {
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <img src={`https://storage.googleapis.com/nof-gamma/T2/${characterId}.png`} alt="NOF" width={500} height={500} />
            <h3 className="text-slate-800 font-lg">  
                Character added successfully
            </h3>
        </div>
    )
}

export const CollectButtons: AllowedButtonsArray = [
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: 1
            },
        }}
    >
        Back
    </Button>,
    <Button
        key={1}
        action="post"
        target={{
            query: { pageIndex: 6 },
        }}
    >
        Inventory
    </Button>,
    <Button
        key={2}
        action="post"
        target={{
            query: { pageIndex: 8 },
        }}
    >
        Missing
    </Button>,
];