import { z } from "zod";
import { AttendanceStatusEnum } from "./types";

export const createOrUpdateAttendanceFromValidation = z.object({
  date:z.string({message:"Date is required"}).min(1,{message:"Date is required"}),
  status: z.nativeEnum(AttendanceStatusEnum),
  remarks: z.string().max(2000, { message: "Remarks can't be more then 2000 connectors" }).optional()
})