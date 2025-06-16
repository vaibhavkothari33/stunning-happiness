// import { connectToDatabase } from "@/app/lib/db";
// import User from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";


// export async function POST(request: NextRequest) {
//     try {
//         const { email, password, phone } = await request.json()

//         if (!email || !password || !phone) {
//             return NextResponse.json(
//                 { error: "Email, Phone and Password are required" },
//                 { status: 400 },
//             )
//         }
//         await connectToDatabase();

//         const exisitngUser = await User.findOne({ email })

//         if (exisitngUser) {
//             return NextResponse.json(
//                 { message: "User already exist" },
//                 { status: 400 },
//             );
//         }

//         await User.create({
//             email, password, phone
//         })

//         return NextResponse.json(
//             { message: "User registered successfully" },
//             { status: 200 },
//         )
//     } catch (error) {
//         console.log("Registerion error", error);
//         return NextResponse.json(   
//             { error: "Failed to create user" },
//             { status: 400 }
//         )

//     }
// }

import User from "@/models/User";
import { connectToDatabase } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { name, email, image, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, Email and Password are required" },
                { status: 400 }
            );
        }
        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const user = await User.create({
            name,
            email,
            image,
            password,
            role: "user",
        });
        return NextResponse.json(
            { message: "User registered successfully", user },
            { status: 201 }
        );

    } catch (error) {
        console.error("Registration error", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );

    }
}