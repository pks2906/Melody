"use client";

import { signIn } from "next-auth/react";

export function Appbar(){
    return <div>
        <div className="flex justify-between">
            <div>
                Melody


            </div>
            <div>
                <button className="m-2 p-2 bg-blue-400" onClick={() => signIn()}>SignIn</button>
            </div>
        </div>
    </div>

}