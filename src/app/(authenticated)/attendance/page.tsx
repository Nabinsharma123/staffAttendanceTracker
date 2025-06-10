"use client"
import CreateOrUpdateStaffAttendanceFrom from "@/components/CreateOrUpdateStaffAttendanceForm";
import { DatePicker } from "@/components/datePicker";
import Loading from "@/components/Loading";
import StaffAttendanceCalenderModalView from "@/components/StaffAttendanceCalenderModalView";
import { staffAttendanceTableColumns } from "@/components/tables/columns"
import { DataTable } from "@/components/tables/dataTable"
import { Button } from "@/components/ui/button";
import { prepareCreateAttendancePayload, prepareUpdateAttendancePayload } from "@/lib/helpers";
import { createStaffAttendance, getAttendances, getStaffAttendances, getStaffs, updateStaffAttendance } from "@/lib/model";
import { AttendanceStatusEnum, AttendanceType, CreateOrUpdateAttendanceFromType, StaffAttendanceTableType, StaffType } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const Page = () => {

    const [staffs, setStaffs] = useState<StaffType[]>([]);
    const [aggregatedStaffsData, setAggregatedStaffsData] = useState<StaffAttendanceTableType[]>([]);
    const [attendances, setAttendances] = useState<AttendanceType[]>([]);
    const [filteredAttendances, setFilteredAttendances] = useState<AttendanceType[]>([]);
    const [filterDates, setFilterDates] = useState<{
        starting: string | undefined,
        ending: string | undefined
    }>({
        starting: undefined,
        ending: undefined
    });

    const [selectedStaff, setSelectedStaff] = useState<StaffAttendanceTableType | undefined>(undefined);
    const [calenderDateToAddAttendance, setCalenderDateToAddAttendance] = useState<string | undefined>(undefined);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [attendanceToUpdate, setAttendanceToUpdate] = useState<AttendanceType | undefined>(undefined);
    const [selectedStaffAttendances, setSelectedStaffAttendances] = useState<AttendanceType[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const initializePage = async () => {

        setIsLoading(true)
        const response = await Promise.all([
            getStaffs(() => {
                toast.error("Error while getting staffs")
            }),
            getAttendances(() => {
                toast.error("Error while getting Attendances")
            })
        ])


        const staffs = response?.[0],
            attendances = response?.[1]

        setStaffs(staffs)
        setAttendances(attendances)
        setFilteredAttendances(attendances)

         const preparedStaffs = staffs.map((staff) => calculateAggregatedStaffData(staff, attendances))
        setAggregatedStaffsData(preparedStaffs)
        setIsLoading(false)
    }



    const calculateAggregatedStaffData = <T,>(staff: T & { id: string, name: string }, attendances: AttendanceType[]) => {
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

        const preparedStaff = {
            id: staff?.id,
            name: staff?.name,
            totalAbsents,
            totalLeaves,
            totalPresents
        }


        return preparedStaff
    }


    const reCalculateAndSetStaffAggregateData = (staffId: string, attendances: AttendanceType[]) => {

        const updatedStaffIndex = aggregatedStaffsData?.findIndex((_staff) => _staff?.id === staffId)

        if (updatedStaffIndex === -1) {
            toast.error("Staff Not Found")
            return
        }

        const updatedStaff = calculateAggregatedStaffData(aggregatedStaffsData[updatedStaffIndex], attendances)

        const updatedStaffs = structuredClone(aggregatedStaffsData)

        updatedStaffs[updatedStaffIndex] = updatedStaff

        setAggregatedStaffsData(updatedStaffs)

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


        const updatedFilteredAttendanceIndex = filteredAttendances?.findIndex((filteredAttendance) => filteredAttendance?.id === attendanceId)

        if (updatedAttendanceIndex === -1) {
            toast.error("Filtered Attendance Not Found")
            return
        }

        const updatedFilteredAttendances = structuredClone(filteredAttendances)

        updatedFilteredAttendances[updatedFilteredAttendanceIndex] = {
            ...updatedFilteredAttendances[updatedFilteredAttendanceIndex],
            status: newAttendance?.status,
            remarks: newAttendance?.remarks
        }

        setFilteredAttendances(updatedFilteredAttendances)


        filterAndSetSelectedStaffAttendances(updatedAttendances, selectedStaff?.id as string)
        console.log(updatedFilteredAttendances);
        
        reCalculateAndSetStaffAggregateData(selectedStaff?.id as string, updatedFilteredAttendances)
    }

    const createLocalAttendance = (attendanceId: string, payload: Omit<AttendanceType, "id">) => {
        const newAttendance={
                id: attendanceId,
                ...payload
            }
        
        const updatedAttendances: AttendanceType[] = [
            ...attendances,
            newAttendance
        ]

        setAttendances(updatedAttendances)
        const newFilteredAttendances=[...filteredAttendances,newAttendance]
        setFilteredAttendances(newFilteredAttendances)


        filterAndSetSelectedStaffAttendances(updatedAttendances, selectedStaff?.id as string)
        reCalculateAndSetStaffAggregateData(selectedStaff?.id as string, newFilteredAttendances)

    }


    const filterAndSetSelectedStaffAttendances = (attendances: AttendanceType[], staffId: string) => {
        const staffAttendances = attendances?.filter((event) => event?.staffId === staffId)
        setSelectedStaffAttendances(staffAttendances)
    }

    const onRowClick = async (data: StaffAttendanceTableType) => {
        filterAndSetSelectedStaffAttendances(attendances, data?.id)
        setSelectedStaff(data)
    }

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


    const isAttendanceInFilteredRange=(attendanceDate: string) =>
                new Date(attendanceDate) >= new Date(filterDates?.starting as string ) && 
                new Date(attendanceDate) <= new Date(filterDates?.ending as string)
    
    const isFilterRangeValid=()=>filterDates?.starting && filterDates?.ending

    const onFilterDateSelect = () => {

        
        
        let filteredAttendances:AttendanceType[]=[]
        if (isFilterRangeValid()) {
            
            filteredAttendances = attendances?.filter((attendance) =>
                isAttendanceInFilteredRange(attendance?.date)
        )
        console.log(filteredAttendances)
            setFilteredAttendances(filteredAttendances)
            
        }else{
            filteredAttendances=attendances
            setFilteredAttendances(attendances)
        }

        

        const preparedStaffs = staffs.map((staff) => calculateAggregatedStaffData(staff, filteredAttendances))
        setAggregatedStaffsData(preparedStaffs)

    }


    useEffect(() => {
        onFilterDateSelect()

    }, [filterDates])

    useEffect(() => { initializePage() }, [])


    return (
        <div className="h-full relative">
            {isLoading && <Loading />}

            <div className="flex w-full sm:justify-end mb-2">
                <div className="flex flex-col sm:flex-row gap-2">
                    <DatePicker placeholder="Starting date" date={filterDates?.starting} onDateChange={(date) => setFilterDates((prev) => {
                        return {
                            ...prev,
                            starting: date
                        }
                    })} />
                    <DatePicker placeholder="Ending date"  date={filterDates?.ending} onDateChange={(date) => setFilterDates((prev) => {
                        return {
                            ...prev,
                            ending: date
                        }
                    })} />

                    <Button onClick={() => setFilterDates({
                        ending: undefined,
                        starting: undefined
                    })} >Clear</Button>

                </div>

            </div>

            <DataTable columns={staffAttendanceTableColumns} data={aggregatedStaffsData} onRowClick={onRowClick} />


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