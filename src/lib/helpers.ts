import { AttendanceType, CalendarEventType, AttendanceStatusEnum, CreateOrUpdateAttendanceFromType, StaffType, createOrUpdateStaffFormType } from "./types";

export const handleRequest = async <T>(req: Promise<T>) => {
    try {
        const data = await req;
        return { data, error: null };
    }
    catch (error) {
        return { data: null, error: error };
    }
}

export const prepareCalenderEventData = (attendance: AttendanceType): CalendarEventType => ({
    id: attendance?.id,
    start: attendance?.date,
    title: attendance?.status,
    backgroundColor:
        attendance?.status === AttendanceStatusEnum.PRESENT ?
            "green" :
            attendance?.status === AttendanceStatusEnum.ABSENT ?
                "red" : "goldenrod",
})


export const prepareCreateAttendancePayload = (
    formData: CreateOrUpdateAttendanceFromType,
    staffId: string
): Omit<AttendanceType, "id"> => ({
    date: formData?.date,
    staffId,
    status: formData?.status,
    updatedAt: Date?.now().toLocaleString(),
    remarks: formData?.remarks,
    CreatedById: ""
})

export const prepareUpdateAttendancePayload = (
    formData: CreateOrUpdateAttendanceFromType,
): Pick<AttendanceType, "status" | "remarks"> => ({
    status: formData?.status,
    remarks: formData?.remarks
})

export const prepareCreateStaffPayload = (
    formData: createOrUpdateStaffFormType,
): Omit<StaffType, "id"> => ({
    name: formData?.name,
    email: formData?.email,
    createdAt: Date.now().toLocaleString(),
    role: formData?.role
})

export const prepareUpdateStaffPayload = (
    formData: createOrUpdateStaffFormType,
): Omit<StaffType, "id"|"createdAt"> => ({
    name: formData?.name,
    email: formData?.email,
    role: formData?.role
})

