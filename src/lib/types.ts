import { z } from "zod"
import { createOrUpdateAttendanceFromValidation, createOrUpdateStaffValidation, loginFormValidation } from "./validations"

export type UserType={
  id:string,
  email:string,
  displayName:string
}


export type StaffType = {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  role: string
}

export type StaffAttendanceTableType={
  id:string
  name:string,
  totalPresents:number,
  totalAbsents:number,
  totalLeaves:number
}

export type AttendanceStatus = 'present' | 'absent' | 'leave'

export enum AttendanceStatusEnum {
  PRESENT = "present",
  ABSENT = "absent",
  LEAVE = "leave"
}

export type AttendanceType = {
  id:string
  staffId: string
  status: AttendanceStatusEnum
  remarks?: string
  date:string
  CreatedById: string
  updatedAt: string
}

export type CalendarEventType = {
  id: string
  title: string
  start: string
  backgroundColor?: string
}

export type AttendanceDetailsType = {
  status: AttendanceStatusEnum
  remarks?: string
}

export type CreateOrUpdateAttendanceFromType = z.infer<typeof createOrUpdateAttendanceFromValidation>

export type createOrUpdateStaffFormType=z.infer<typeof createOrUpdateStaffValidation>

export type LoginFormValidationType=z.infer<typeof loginFormValidation>