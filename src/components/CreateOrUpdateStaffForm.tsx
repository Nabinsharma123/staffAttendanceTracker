"use client"

import {createOrUpdateStaffFormType, StaffType } from "@/lib/types";
import { createOrUpdateStaffValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import {  SubmitHandler, useForm } from "react-hook-form";
import FreeFormModal from "./FreeFormModal";
import { Button } from "./ui/button";
import { Form,FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useEffect } from "react";

type ComponentPropsType = {
    staff?: StaffType
    close?: () => void
    onSubmit?: (data:createOrUpdateStaffFormType,type:"create"|"update") => void
    isFormLoading?:boolean
}

const CreateOrUpdateStaffForm = (props: ComponentPropsType) => {

    const { staff, close, onSubmit, isFormLoading } = props

    const form = useForm<createOrUpdateStaffFormType>({
        resolver: zodResolver(createOrUpdateStaffValidation),
        defaultValues: {
            email: staff?.email,
            name: staff?.name,
            role: staff?.role
        }
    })


    const onFormSubmit: SubmitHandler<createOrUpdateStaffFormType> = (data) => {
        onSubmit?.(data, staff ? "update" : "create")
    }



    return (
        <FreeFormModal title="Staff" close={close}>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">

         <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          
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

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" disabled={isFormLoading}>
            {isFormLoading && <Loader2Icon className="animate-spin" />}
            {staff ? "Update" : "Create"}
          </Button>
        </form>
      </Form>


    </FreeFormModal>
    )
};

export default CreateOrUpdateStaffForm;
