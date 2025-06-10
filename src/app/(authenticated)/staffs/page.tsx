"use client"
import CreateOrUpdateStaffAttendanceFrom from "@/components/CreateOrUpdateStaffAttendanceForm";
import CreateOrUpdateStaffForm from "@/components/CreateOrUpdateStaffForm";
import Loading from "@/components/Loading";
import StaffAttendanceCalenderModalView from "@/components/StaffAttendanceCalenderModalView";
import StaffViewCard from "@/components/StaffViewCard";
import { createStaffTableColumns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/dataTable"
import { Button } from "@/components/ui/button";
import { prepareCreateAttendancePayload, prepareCreateStaffPayload, prepareUpdateAttendancePayload, prepareUpdateStaffPayload } from "@/lib/helpers";
import { createStaff, createStaffAttendance, deleteStaff, getStaffAttendances, getStaffs, updateStaff, updateStaffAttendance } from "@/lib/model";
import { AttendanceType, CreateOrUpdateAttendanceFromType, createOrUpdateStaffFormType, StaffType } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";



const Page = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [staffs, setStaffs] = useState<StaffType[]>([]);
  const [staffToUpdate, setStaffToUpdate] = useState<StaffType|undefined>(undefined);
  const [openCreateOrUpdateStaffForm, setOpenCreateOrUpdateStaffForm] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [openStaffViewModal, setOpenStaffViewModal] = useState<StaffType|undefined>(undefined);

  const rowActionClick = async(type: "edit" | "delete", data: StaffType) => {
      if(type==="edit"){
        setStaffToUpdate(data)
        setOpenCreateOrUpdateStaffForm(true)
      } else{
        setIsLoading(true)
        await deleteStaff(data?.id,
          ()=>{
            toast?.success("Staff deleted")
            deleteLocalStaff(data?.id)
          },()=>{
            toast?.error("Error while deleting Staff")
          },()=>{
            setIsLoading(false)
          }
        )
      }
  }


  const staffTableColumns = useMemo(() => createStaffTableColumns(rowActionClick), []);

  const onRowClick = (data: StaffType,cellId:string) => {
    if(cellId!=="actions")
    
      setOpenStaffViewModal(data)
  }


  const initializePage = async () => {
    setIsLoading(true)
    const staff = await getStaffs(() => {
      toast.error("Error while getting staffs")
    })
    setStaffs(staff)
    setIsLoading(false)

  }

  const closeCreateOrUpdateStaffForm = () => {
    setOpenCreateOrUpdateStaffForm(false)
    setStaffToUpdate(undefined)
  }


  const createLocalStaff=(staffId:string,payload:Omit<StaffType, "id">)=>{
    const updatedStaffs=[
      {
        id:staffId,
        ...payload
      },
      ...staffs
    ]

    setStaffs(updatedStaffs)
  }

   const updateLocalStaff=(staffId:string,payload: Omit<StaffType, "id" | "createdAt">)=>{
    const updatedStaffIndex=staffs?.findIndex((staff)=>staff?.id===staffId)

    if(updatedStaffIndex===-1){
      toast.error("Staff not Found")
      return
    }

    const updatedStaffs=structuredClone(staffs)

    updatedStaffs[updatedStaffIndex]={
      ...updatedStaffs[updatedStaffIndex],
      email:payload?.email,
      name:payload?.name,
      role:payload?.role
    }

    setStaffs(updatedStaffs)
  }

  const deleteLocalStaff=(staffId:string)=>{
    
    const updatedStaffs=staffs?.filter((staff)=>staff?.id!==staffId)
    setStaffs(updatedStaffs)
  }


  const CreateOrUpdateStaffFormSubmit=(data:createOrUpdateStaffFormType,type:"create"|"update")=>{
      setIsFormLoading(true)
    
    if(type==="create"){
        const payload=prepareCreateStaffPayload(data)
        createStaff(payload,
          (docId)=>{
              toast.success("Staff Created")
              createLocalStaff(docId,payload)
              closeCreateOrUpdateStaffForm()
          },
          ()=>{
            toast.error("Error While Creating Staff")
          },()=>{
            setIsFormLoading(false)
          }
        )
      } else {

        if(!staffToUpdate) {
          toast.error("Staff Not Found")
          return 
        }

        const payload=prepareUpdateStaffPayload(data)

        updateStaff(
          staffToUpdate?.id,
          payload,
          ()=>{
              toast.success("Staff Updated")
              updateLocalStaff(staffToUpdate?.id,payload)
              closeCreateOrUpdateStaffForm()
          },
          ()=>{
            toast.error("Error While Updating Staff")
          },()=>{
            setIsFormLoading(false)
          }
        )
      }
  }

  useEffect(() => { initializePage() }, [])

  return (
    <div className="h-full relative">
      {isLoading && <Loading />}

      <div className="flex w-full justify-end mb-2">
        <Button onClick={() => setOpenCreateOrUpdateStaffForm(true)} >Create Staff</Button>
      </div>
      <DataTable columns={staffTableColumns} data={staffs} onRowClick={onRowClick} />

      {openCreateOrUpdateStaffForm &&
        <CreateOrUpdateStaffForm staff={staffToUpdate} isFormLoading={isFormLoading} onSubmit={CreateOrUpdateStaffFormSubmit} close={closeCreateOrUpdateStaffForm} />
      }

      {openStaffViewModal&&
      <StaffViewCard staff={openStaffViewModal} close={()=>setOpenStaffViewModal(undefined)} />
      }
    </div>
  )
}

export default Page