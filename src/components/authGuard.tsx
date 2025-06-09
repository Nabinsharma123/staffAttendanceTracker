"use client"

import { auth } from "@/lib/firebase";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation'

const AuthGuard = ({ children }: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()
    const pathname = usePathname()

    auth.onAuthStateChanged((session) => {
        if(!session && pathname!=="/login"){
            return router.replace("/login")
        }

        if(pathname==="/login") router.replace("/")
        setIsLoading(false)
    })

    return (
        <>
            {isLoading
             ?
             <div>Loading</div>
             :
             children
            }
        </>
    )
};

export default AuthGuard;
