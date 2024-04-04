import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface CollectProps {
    userData: any
}

export const Collect = ({ userData }: CollectProps) => {
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <img src={`${process.env.DOMAIN_URL}/api/collect?DiscordID=${userData.discordID}`} alt="NOF" width={800} height={800} />
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
    key={3}
    action="post"
    target={{
        query: { pageIndex: 7 },
    }}
>
    Missing
</Button>,
];