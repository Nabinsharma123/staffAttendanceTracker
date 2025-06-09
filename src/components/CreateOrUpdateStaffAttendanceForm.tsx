"use client"

import { AttendanceDetailsType, AttendanceStatus, AttendanceStatusEnum, AttendanceType, CreateOrUpdateAttendanceFromType } from "@/lib/types";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { FormItem, FormLabel, FormControl, FormMessage, Form, FormField } from "./ui/form";
import FreeFormModal from "./FreeFormModal";
import { zodResolver } from "@hookform/resolvers/zod"
import { createOrUpdateAttendanceFromValidation } from "@/lib/validations";
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";


type ComponentPropsType = {
  isFormLoading?: boolean
  attendanceToUpdate?: AttendanceType,
  calenderDateToAddAttendance?:string,
  close?: () => void
  onSubmit: (data: CreateOrUpdateAttendanceFromType, type: "create" | "update") => void
}

const CreateOrUpdateStaffAttendanceFrom = (props: ComponentPropsType) => {

  const { attendanceToUpdate, close, onSubmit, isFormLoading, calenderDateToAddAttendance } = props

  const form = useForm<CreateOrUpdateAttendanceFromType>({
    resolver: zodResolver(createOrUpdateAttendanceFromValidation),
    defaultValues: {
      date:attendanceToUpdate?attendanceToUpdate?.date:calenderDateToAddAttendance,
      remarks: attendanceToUpdate?.remarks??"",
      status: attendanceToUpdate?.status??AttendanceStatusEnum?.PRESENT
    }
  })


  const onFormSubmit: SubmitHandler<CreateOrUpdateAttendanceFromType> = (data) => {
    onSubmit(data, attendanceToUpdate ? "update" : "create")
  }



  return (
    <FreeFormModal title="Attendance" close={close}>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="w-2/3 space-y-6">

         <FormField
            control={form.control}
            name="date"
            render={({ field,fieldState }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="Date" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          
          <FormField
            control={form.control}
            name="status"
            render={({ field,fieldState }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value)=>field?.onChange(value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {Object.values(AttendanceStatusEnum).map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea placeholder="Select" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit">{
            isFormLoading ? <Loader2Icon className="animate-spin" /> :
              attendanceToUpdate ? "Update" : "Create"
          }</Button>
        </form>
      </Form>


    </FreeFormModal>
  )
};

export default CreateOrUpdateStaffAttendanceFrom;
