/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Cover, CoverButtons } from "@/components/Cover";
import { AllowedButtonsArray } from "@/types/frames";
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

const frames = createFrames({
    basePath: "/multipage",
    initialState: {
        pageIndex: 0,
    },
});


interface DefaultFrameProps{
    imageUrl: string;
    pageIndex: number;
}
const DefaultFrame = ({imageUrl, pageIndex}: DefaultFrameProps)=>{
    return (
        <div tw="flex flex-col">
            <img width={300} height={200} src={imageUrl} alt="Image" />
            <div tw="flex">
                This is slide {pageIndex + 1} / {totalPages}
            </div>
        </div>
    )
}

const defaultButtons = (pageIndex: number): any[] => ([
    <Button
        key={0}
        action="post"
        target={{
            query: { pageIndex: (pageIndex - 1) % totalPages },
        }}
    >
        ←
    </Button>,
    <Button
        key={1}
        action="post"
        target={{
            query: { pageIndex: (pageIndex + 1) % totalPages },
        }}
    >
        →
    </Button>,
]);

const handleRequest = frames(async (ctx) => {
    const pageIndex = Number(ctx.searchParams.pageIndex || 0);

    const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

    const pages: { [key: number]: [JSX.Element | string, AllowedButtonsArray] } = {
        0: [process.env.BASE_URL + "/nof.jpg", CoverButtons],
    }

    return {
        image: (
            pages[pageIndex]?.[0] ?? <DefaultFrame imageUrl={imageUrl} pageIndex={pageIndex} />
        ),
        buttons: (
            pages[pageIndex]?.[1] ?? defaultButtons(pageIndex)
        ),
    };
});

export const GET = handleRequest;
export const POST = handleRequest;