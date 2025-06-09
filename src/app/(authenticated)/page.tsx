"use client"
import CreateOrUpdateStaffAttendanceFrom from "@/components/CreateOrUpdateStaffAttendanceForm";
import FreeFormModal from "@/components/FreeFormModal";
import Loading from "@/components/Loading";
import StaffAttendanceCalenderModalView from "@/components/StaffAttendanceCalenderModalView";
import AttendanceCalendar from "@/components/StaffAttendanceCalenderModalView";
import { columns } from "@/components/tables/staff/columns"
import { DataTable } from "@/components/tables/staff/dataTable"
import { db } from "@/lib/firebase";
import { prepareCalenderEventData, prepareCreateAttendancePayload, prepareUpdateAttendancePayload } from "@/lib/helpers";
import { createStaffAttendance, getStaffAttendances, getStaffs, updateStaffAttendance } from "@/lib/model";
import { AttendanceDetailsType, AttendanceStatusEnum, AttendanceType, CalendarEventType, CreateOrUpdateAttendanceFromType, StaffType } from "@/lib/types";
import { collection, getDoc, getDocs, Query, query, where } from "firebase/firestore/lite";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";



const Page = () => {
  const fetchStaffsQuery = query(collection(db, "staffs"))

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

      <DataTable columns={columns} data={staffs} onRowClick={onRowClick} />
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