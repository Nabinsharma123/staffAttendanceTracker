"use client"
import { columns } from "@/components/tables/staff/columns"
import { DataTable } from "@/components/tables/staff/dataTable"
import { db } from "@/lib/firebase";
import { Staff } from "@/lib/types";
import { collection, getDoc, getDocs, Query, query } from "firebase/firestore/lite";
import { useEffect, useState } from "react";



const Page = () => {
  const staffQuery = query(collection(db, "staff"))

  const [staff, setStaff] = useState<Staff[]>([]);


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


  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={staff} />
    </div>
  )
}

export default Page