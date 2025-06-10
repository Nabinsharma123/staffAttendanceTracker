"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { FormEvent } from "react"
import { useForm } from "react-hook-form"
import { loginFormValidation } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormValidationType } from "@/lib/types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Loader2Icon } from "lucide-react"


type ComponentProps = {
  isFormLoading:boolean,
  onSubmit:(data: LoginFormValidationType)=>void
}

export const LoginForm = (
  props
    : ComponentProps
) => {

  const {isFormLoading,onSubmit}=props

  const form = useForm<LoginFormValidationType>({
    resolver: zodResolver(loginFormValidation),

  })


  const onFormSubmit = async (data: LoginFormValidationType) => {
    onSubmit?.(data)
  }

  return (
    <div className="flex flex-col gap-6" >

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className=" space-y-6">
              <div className="grid gap-6">

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isFormLoading && <Loader2Icon className="animate-spin" />}
                    Login
                  </Button>
                </div>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
