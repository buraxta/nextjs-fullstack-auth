import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs";


connect()


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody

        console.log(reqBody);

        const  user = await User.findOne({email})
        
        //check user existance
        if(user){
            return NextResponse.json({error: "User already exist"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        //create user
        const newUser = new User({
            username, email, password: hashedPassword
        })

        //save
        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({message: "User created successfully", success: true, savedUser})
        

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}