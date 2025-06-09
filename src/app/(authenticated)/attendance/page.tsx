"use client"
import CreateOrUpdateStaffAttendanceFrom from "@/components/CreateOrUpdateStaffAttendanceForm";
import Loading from "@/components/Loading";
import StaffAttendanceCalenderModalView from "@/components/StaffAttendanceCalenderModalView";
import { staffAttendanceTableColumns, staffTableColumns } from "@/components/tables/columns"
import { DataTable } from "@/components/tables/dataTable"
import { Button } from "@/components/ui/button";
import { prepareCreateAttendancePayload, prepareUpdateAttendancePayload } from "@/lib/helpers";
import { createStaffAttendance, getAttendances, getStaffAttendances, getStaffs, updateStaffAttendance } from "@/lib/model";
import { AttendanceStatusEnum, AttendanceType, CreateOrUpdateAttendanceFromType, StaffAttendanceTableType, StaffType } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const Page = () => {

    const [staffs, setStaffs] = useState<StaffAttendanceTableType[]>([]);
    const [attendances, setAttendances] = useState<AttendanceType[]>([]);


    const [selectedStaff, setSelectedStaff] = useState<StaffAttendanceTableType | undefined>(undefined);
    const [calenderDateToAddAttendance, setCalenderDateToAddAttendance] = useState<string | undefined>(undefined);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [attendanceToUpdate, setAttendanceToUpdate] = useState<AttendanceType | undefined>(undefined);
    const [selectedStaffAttendances, setSelectedStaffAttendances] = useState<AttendanceType[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const initializePage = async () => {

        setIsLoading(true)
        const response=await Promise.all([
            getStaffs(() => {
                toast.error("Error while getting staffs")
            }),
            getAttendances(() => {
                toast.error("Error while getting Attendances")
            })
        ])


        const staffs=response?.[0],
            attendances=response?.[1]

        const preparedStaffs=staffs.map((staff)=>calculateAggregatedStaffData(staff,attendances))
        setStaffs(preparedStaffs)
        setAttendances(attendances)
        setIsLoading(false)
    }



    const calculateAggregatedStaffData =<T,> (staff: T&{id:string,name:string}, attendances: AttendanceType[]) => {  
            let totalPresents = 0,
                totalAbsents = 0,
                totalLeaves = 0;

            attendances
                ?.filter((attendance) => attendance?.staffId === staff?.id)
                ?.forEach((attendance) => {
                    if (attendance?.status === AttendanceStatusEnum.PRESENT) totalPresents++
                    else if (attendance?.status === AttendanceStatusEnum.ABSENT) totalAbsents++
                    else if (attendance?.status === AttendanceStatusEnum.LEAVE) totalLeaves++
                })

            const preparedStaff= {
                id: staff?.id,
                name: staff?.name,
                totalAbsents,
                totalLeaves,
                totalPresents
            }
        

        return preparedStaff
    }


    const reCalculateAndSetStaffAggregateData=(staffId:string,attendances:AttendanceType[])=>{
        
        const updatedStaffIndex = staffs?.findIndex((_staff) => _staff?.id === staffId)
        
        if (updatedStaffIndex === -1) {
            toast.error("Staff Not Found")
            return
        }

        const updatedStaff=calculateAggregatedStaffData(staffs[updatedStaffIndex],attendances)

        const updatedStaffs = structuredClone(staffs)

        updatedStaffs[updatedStaffIndex] = updatedStaff

        setStaffs(updatedStaffs)

    }




    const updateLocalAttendance = (attendanceId: string, newAttendance: Pick<AttendanceType, "status" | "remarks">) => {

        const updatedAttendanceIndex = attendances?.findIndex((attendance) => attendance?.id === attendanceId)

        if (updatedAttendanceIndex === -1) {
            toast.error("Attendance Not Found")
            return
        }

        const updatedAttendances = structuredClone(attendances)

        updatedAttendances[updatedAttendanceIndex] = {
            ...updatedAttendances[updatedAttendanceIndex],
            status: newAttendance?.status,
            remarks: newAttendance?.remarks
        }

        setAttendances(updatedAttendances)
        filterAndSetSelectedStaffAttendances(updatedAttendances, selectedStaff?.id as string)
        reCalculateAndSetStaffAggregateData(selectedStaff?.id as string,updatedAttendances)
    }

    const createLocalAttendance = (attendanceId: string, payload: Omit<AttendanceType, "id">) => {
        const updatedAttendances: AttendanceType[] = [
            ...attendances,
            {
                id: attendanceId,
                ...payload
            }
        ]

        setAttendances(updatedAttendances)
        filterAndSetSelectedStaffAttendances(updatedAttendances, selectedStaff?.id as string)
        reCalculateAndSetStaffAggregateData(selectedStaff?.id as string,updatedAttendances)
    }


    const filterAndSetSelectedStaffAttendances = (attendances: AttendanceType[], staffId: string) => {
        const staffAttendances = attendances?.filter((event) => event?.staffId === staffId)
        setSelectedStaffAttendances(staffAttendances)
    }

    const onRowClick = async (data: StaffAttendanceTableType) => {
        filterAndSetSelectedStaffAttendances(attendances, data?.id)
        setSelectedStaff(data)
    }

    useEffect(()=>{
        console.log(selectedStaffAttendances);
        
    },[selectedStaffAttendances])

    const onDateClick = (date: string) => {
        const attendance = selectedStaffAttendances?.find((event) => event?.date === date)
        if (attendance) {
            setAttendanceToUpdate(attendance)
        } else {
            setCalenderDateToAddAttendance(date)
        }
    }

    const closeStaffAttendanceCalenderModal = () => {
        setSelectedStaffAttendances([])
        setSelectedStaff(undefined)
    }

    const closeStaffAttendanceFormModal = () => {
        setCalenderDateToAddAttendance(undefined)
        setAttendanceToUpdate(undefined)
    }

    const createOrUpdateStaffAttendanceFromSubmit = (data: CreateOrUpdateAttendanceFromType, type: "create" | "update") => {

        if (!selectedStaff) {
            toast.error("Staff Not Found")
            return
        }

        setIsFormLoading(true)
        if (type == "create") {


            const payload = prepareCreateAttendancePayload(data, selectedStaff?.id)
            createStaffAttendance(payload,
                (docId) => {
                    toast.success("Attendance Added")
                    //   fetchAndSetSelectedStaffAttendances(selectedStaff?.id)
                    createLocalAttendance(docId, payload)
                    closeStaffAttendanceFormModal()
                },
                () => {
                    toast.error("Error While Adding Attendance")
                },
                () => {
                    setIsFormLoading(false)
                }
            )
        } else {

            if (!attendanceToUpdate) {
                toast.error("Attendance Not Found")
                setIsFormLoading(false)
                return
            }

            const payload = prepareUpdateAttendancePayload(data)

            updateStaffAttendance(attendanceToUpdate?.id, payload,
                () => {
                    toast.success("Attendance Updated")
                    updateLocalAttendance(attendanceToUpdate?.id, payload)
                    closeStaffAttendanceFormModal()
                },
                () => {
                    toast.error("Error While Updating Attendance")
                },
                () => {
                    setIsFormLoading(false)
                }
            )
        }
    }


    useEffect(() => { initializePage() }, [])


    return (
        <div className="h-full relative">
            {isLoading && <Loading />}

            <DataTable columns={staffAttendanceTableColumns} data={staffs} onRowClick={onRowClick} />


            {selectedStaff &&
                <StaffAttendanceCalenderModalView
                    attendances={selectedStaffAttendances}
                    onDateClick={(data) => onDateClick(data?.dateStr)}
                    onEventClick={(data) => onDateClick(data?.event?.startStr)}
                    close={closeStaffAttendanceCalenderModal}
                />}

            {(calenderDateToAddAttendance || attendanceToUpdate) &&
                <CreateOrUpdateStaffAttendanceFrom
                    calenderDateToAddAttendance={calenderDateToAddAttendance}
                    isFormLoading={isFormLoading}
                    onSubmit={createOrUpdateStaffAttendanceFromSubmit}
                    attendanceToUpdate={attendanceToUpdate}
                    close={closeStaffAttendanceFormModal} />
            }
        </div>
    )
}

export default Page