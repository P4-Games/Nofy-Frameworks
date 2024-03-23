import { AllowedButtonsArray } from "@/types/frames";
import { Button } from "frames.js/next"

export const Cover = ()=>{
    return (
        <div tw="flex flex-col">
            <img src={process.env.BASE_URL + "/nof.jpg"} alt="Image" width={1080} height={566} />
        </div>
    )
}

export const CoverButtons: AllowedButtonsArray = [
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: 1 },
        }}
    >
        Start
    </Button>,
];