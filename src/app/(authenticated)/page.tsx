"use client"
import StaffAttendanceCalenderModalView from "@/components/StaffAttendanceCalenderModalView";
import AttendanceCalendar from "@/components/StaffAttendanceCalenderModalView";
import { columns } from "@/components/tables/staff/columns"
import { DataTable } from "@/components/tables/staff/dataTable"
import { db } from "@/lib/firebase";
import { Staff } from "@/lib/types";
import { collection, getDoc, getDocs, Query, query } from "firebase/firestore/lite";
import { useEffect, useState } from "react";



const Page = () => {
  const staffQuery = query(collection(db, "staff"))

  const [staff, setStaff] = useState<Staff[]>([]);

  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);


  const initializePage = async () => {
    let preparedStaffData: Staff[] = []
    const staffsQuerySnapshot = await getDocs(staffQuery)
    staffsQuerySnapshot?.forEach((doc) => {
      const docData = doc.data() as Omit<Staff, "id">
      preparedStaffData = [
        ...preparedStaffData,
        {
          id: doc?.id,
          ...docData
        }
      ]

      setStaff(preparedStaffData)
    })


  }

  useEffect(() => { initializePage() }, [])

//   const mockEvents = [
//   {
//     id: '1',
//     title: 'Present',
//     start: '2025-06-07',
//     backgroundColor: 'green',
//     extendedProps: {
//       staffId: 'staff_1',
//       status: 'present' ,
//     },
//   },
//   {
//     id: '2',
//     title: 'Absent',
//     start: '2025-06-08',
//     backgroundColor: 'red',
//     extendedProps: {
//       staffId: 'staff_1',
//       status: 'absent' ,
//       remark: 'Sick leave',
//     },
//   },
// ]

  const onRowClick=(data:Staff)=>{
    console.log(staff);
    setOpenAttendanceModal(true)
    
  }


  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={staff} onRowClick={onRowClick} />
      {openAttendanceModal&&<StaffAttendanceCalenderModalView close={()=>{
        setOpenAttendanceModal(false)
      }}  />}
    </div>
  )
}

export default Page