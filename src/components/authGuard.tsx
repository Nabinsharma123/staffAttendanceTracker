"use client"

import { auth } from "@/lib/firebase";
import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation'
import { UserType } from "@/lib/types";
import Loading from "./Loading";

export const UserContext = createContext<UserType | undefined>(undefined)


const AuthGuard = ({ children }: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserType | undefined>(undefined);
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((session) => {
            
            if (!session) {
                setIsLoading(false);
                if(pathname !== "/login")
                  router.replace("/login");
                return 
            }

            setUser({
                id: session?.uid ,
                email: session?.email as string,
                displayName: session?.displayName as string,
            });
            
            if (!["/staffs","/attendance"].includes(pathname)) router.replace("/staffs");
            setIsLoading(false);
        });

        return () => unsubscribe(); // cleanup the listener
    }, [pathname]);

    return (
        <>
            {isLoading
                ?
                <Loading />
                :
                <UserContext value={user}>
                    {children}
                </UserContext>
            }
        </>
    )
};

export default AuthGuard;
