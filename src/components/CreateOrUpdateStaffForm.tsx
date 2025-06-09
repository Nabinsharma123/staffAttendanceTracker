import { AttendanceStatusEnum, createOrUpdateStaffFormType, StaffType } from "@/lib/types";
import { createOrUpdateStaffValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Loader2Icon } from "lucide-react";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import FreeFormModal from "./FreeFormModal";
import { Button } from "./ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

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
        <FreeFormModal title="Attendance" close={close}>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="w-2/3 space-y-6">

         <FormField
            control={form.control}
            name="name"
            render={({ field,fieldState }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          
          <FormField
            control={form.control}
            name="email"
            render={({ field,fieldState }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
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
                <FormLabel>Remarks</FormLabel>
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
