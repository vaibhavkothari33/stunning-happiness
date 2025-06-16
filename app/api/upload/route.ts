import { authOptions } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
        const formdata = await request.formData();
        const file = formdata.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            )
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // upload kar do aab

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "image", folder: "quiz_images" },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result)
                }
            ).end(buffer);
        }
    )
    return NextResponse.json({ imageUrl: result.secure_url })
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
    }
}