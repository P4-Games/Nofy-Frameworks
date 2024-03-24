import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Rules = ()=>{
    const texts = [
        "A new Nofy will be available every 5min.",
        "The first user to collect gets the character.",
        "Check your inventory.",
        "You can only collect a Nofy if you are the first to collect.",
        "If you already have a Nofy in your inventory you will not be able to collect it.",
        "Collect all of them.",
        "Only then can you choose the one you like best and mint your NFT.",
        "Once you have mined your NFT your inventory will be reset and you will be able to replay the game.",
        "Enjoy the adventure and become the Number One Fan!",
    ]
    return (
        <div tw="flex flex-col bg-slate-800 w-full h-full p-20">
            {texts.map((text, index) => {
                return (
                    <p key={index} tw="py-0 my-2 text-2xl text-emerald-400">
                        • {text}
                    </p>
                )
            })}
        </div>
    )
}

export const RulesButtons: AllowedButtonsArray = [
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: 1 },
        }}
    >
        Back
    </Button>,
];