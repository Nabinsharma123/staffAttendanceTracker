"use client"

import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { LoginFormValidationType } from "@/lib/types"
import { loginUser } from "@/lib/model"
import { useState } from "react";
import { toast } from "sonner"

export default function LoginPage() {

  const [isFormLoading, setIsFormLoading] = useState(false);

  const loginFormSubmit=async(data:LoginFormValidationType)=>{
    setIsFormLoading(true)
    await loginUser(data,()=>{
      toast.success("Logged in Successfully")
    },()=>{
      toast.error("Error while Logged in")
    },()=>{

      setIsFormLoading(false)
    })
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Staff Attendance Tracker
        </a>
        <LoginForm isFormLoading={isFormLoading} onSubmit={loginFormSubmit} />
      </div>
    </div>
  )
}
