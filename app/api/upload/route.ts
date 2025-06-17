// import { authOptions } from "@/app/lib/auth";
// import cloudinary from "@/app/lib/cloudinary";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";


// export async function POST(request: NextRequest) {
//     // const session = await getServerSession(authOptions)

//     // if (!session ) {
//     //     return NextResponse.json(
//     //         { message: "Unauthorized" },
//     //         { status: 401 }
//     //     )
//     // }

//     try {
//         const formdata = await request.formData();
//         const file = formdata.get("file") as File | null;

//         if (!file) {
//             return NextResponse.json(
//                 { error: "No file uploaded" },
//                 { status: 400 }
//             )
//         }

//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         // upload kar do aab

//         const result = await new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream(
//                 { resource_type: "image", folder: "quiz_images" },
//                 (error, result) => {
//                     if (error) {
//                         return reject(error);
//                     }
//                     resolve(result)
//                 }
//             ).end(buffer);
//         }
//     ) as any;
//     return NextResponse.json({ imageUrl: result.secure_url })
//     } catch (error) {
//         console.error('Cloudinary Upload Error:', error);
//         return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
//     }
// }4


import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import type { UploadApiResponse } from 'cloudinary';

export async function POST(request: NextRequest) {

    console.log("📦 API route /api/upload hit");

    try {
        const formdata = await request.formData();
        const file = formdata.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "image", folder: "quiz_images" },
                (error, result) => {
                    if (error || !result) {
                        return reject(error || new Error("Upload failed"));
                    }
                    resolve(result);
                }
            ).end(buffer);
        });


        return NextResponse.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
    }
}
