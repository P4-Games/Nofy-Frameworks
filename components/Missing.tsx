import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

interface MissingProps {
    userData: any
}

export const Missing = ({ userData }: MissingProps) => {
    return (
        <div tw="bg-white text-slate-800 w-full px-12 h-full text-center justify-center items-center flex flex-col">
            <h2 className="text-slate-800 font-lg"> 
            Missing
            </h2>
                <img src={`${process.env.DOMAIN_URL}/api/missing?discordId=${userData.discordID}`} alt="Image" width={700} height={240}/>
        </div>
    )
}

export const MissingButtons: AllowedButtonsArray = [
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
