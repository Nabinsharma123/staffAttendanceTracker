"use client"
import CreateOrUpdateStaffAttendanceFrom from "@/components/CreateOrUpdateStaffAttendanceForm";
import Loading from "@/components/Loading";
import StaffAttendanceCalenderModalView from "@/components/StaffAttendanceCalenderModalView";
import { staffTableColumns } from "@/components/tables/columns"
import { DataTable } from "@/components/tables/dataTable"
import { Button } from "@/components/ui/button";
import { prepareCreateAttendancePayload, prepareUpdateAttendancePayload } from "@/lib/helpers";
import { createStaffAttendance, getStaffAttendances, getStaffs, updateStaffAttendance } from "@/lib/model";
import { AttendanceType, CreateOrUpdateAttendanceFromType, StaffType } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const Page = () => {

  const [staffs, setStaffs] = useState<StaffType[]>([]);


  const [selectedStaff, setSelectedStaff] = useState<StaffType | undefined>(undefined);
  const [calenderDateToAddAttendance, setCalenderDateToAddAttendance] = useState<string | undefined>(undefined);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [attendanceToUpdate, setAttendanceToUpdate] = useState<AttendanceType | undefined>(undefined);
  const [selectedStaffAttendances, setSelectedStaffAttendances] = useState<AttendanceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const initializePage = async () => {
    fetchAndSetSelectedStaff()
  }


  const fetchAndSetSelectedStaff = async () => {
    setIsLoading(true)
    const staffs = await getStaffs(() => {
      toast.error("Error while getting staffs")
    })

    setStaffs(staffs)
    setIsLoading(false)
  }

  useEffect(() => { initializePage() }, [])


  const fetchAndSetSelectedStaffAttendances = async (staffId: string) => {
    setIsLoading(true)
    const staffAttendances = await getStaffAttendances(staffId, () => {
      toast.error("Error while getting Attendances")
    })

    setSelectedStaffAttendances(staffAttendances)

    setIsLoading(false)

  }

  const onRowClick = async (data: StaffType) => {
    await fetchAndSetSelectedStaffAttendances(data?.id)
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


      const payload = prepareCreateAttendancePayload(data, selectedStaff)
      createStaffAttendance(payload,
        () => {
          toast.success("Attendance Added")
          fetchAndSetSelectedStaffAttendances(selectedStaff?.id)
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
          fetchAndSetSelectedStaffAttendances(selectedStaff?.id)
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


  return (
    <div className="h-full relative">
      {isLoading && <Loading />}

      <div className="flex w-full justify-end mb-2">
        <Button>Create Staff</Button>
      </div>
      <DataTable columns={staffTableColumns} data={staffs} onRowClick={onRowClick} />


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