import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//@ts-ignore
import youtubesearchapi from "youtube-search-api";

var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;


const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()

})




export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const  isYt = data.url.match(YT_REGEX)
        if(!isYt) {

            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            })

        }

        const extractedId = data.url.split("?v=")[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);


        const stream =  await prismaClient.stream.create({
            data: {

                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "Can't find video",
                smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "data:image/jpeg;base64,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",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "data:image/jpeg;base64,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"



            }
            


        });
        return NextResponse.json({
            message:"Added stream",
            id: stream.id
        });
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
        
    }
    

}

export async function GET(req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams= await prismaClient.stream.findMany({
        where:  {
            userId: creatorId ?? ""
        }
    })

    return NextResponse.json({
        streams 
    })


}