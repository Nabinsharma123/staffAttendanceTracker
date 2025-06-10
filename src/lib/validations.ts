import { z } from "zod";
import { AttendanceStatusEnum } from "./types";

export const createOrUpdateAttendanceFromValidation = z.object({
  date:z.string({message:"Date is required"}).min(1,{message:"Date is required"}),
  status: z.nativeEnum(AttendanceStatusEnum),
  remarks: z.string().max(2000, { message: "Remarks can't be more then 2000 connectors" }).optional()
})

export const createOrUpdateStaffValidation=z.object({
  name:z.string({message:"Name is required"}).min(1,{message:"Name is required"}).max(255,{message:"Name could not be more than 255 characters long"}),
  role:z.string({message:"Role is required"}).min(1,{message:"Role is required"}).max(255,{message:"Role could not be more than 255 characters long"}),
  email:z.string().email()
})

export const loginFormValidation=z.object({
  email:z.string().email(),
  password:z.string({message:"Password is required"}).min(8,{message:"password should be 8 characters long"}).max(255,{message:"Password could not be more than 255 characters long"})
})