import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { AttendanceType, StaffType } from "./types";
import { db } from "./firebase";
import { handleRequest } from "./helpers";


export const getStaffs = async (
    errorCb?:()=>void
):Promise<StaffType[]> => {
    const fetchStaffsQuery = query(collection(db, "staffs"))
  
    const {data,error} = await handleRequest(getDocs(fetchStaffsQuery))
    
    if(error){
        errorCb?.()
        return []
    }

    let preparedStaffData: StaffType[] = []

    data?.forEach((doc) => {
        const docData = doc.data() as Omit<StaffType, "id">
        preparedStaffData = [
            ...preparedStaffData,
            {
                id: doc?.id,
                ...docData
            }
        ]
    })

    return preparedStaffData
}


export const getStaffAttendances = async (
    staffId: string,
    errorCb?:()=>void
):Promise<AttendanceType[]> => {
    const fetchStaffAttendancesQuery = query(collection(db, "attendances"), where("staffId", "==", staffId))

    const {data,error} = await handleRequest(getDocs(fetchStaffAttendancesQuery))
    
    if(error){
        errorCb?.()
        return []
    }

    let preparedAttendancesData: AttendanceType[] = []

    data?.forEach((doc) => {
        const docData = doc.data() as Omit<AttendanceType, "id">
        preparedAttendancesData = [
            ...preparedAttendancesData,
            {
                id: doc?.id,
                ...docData
            }
        ]
    })

    return preparedAttendancesData
}

export const createStaffAttendance = async (
    payload: Omit<AttendanceType, "id">,
    successCb?: () => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {

    try {
        await addDoc(collection(db, "attendances"),
            payload
        )
        successCb?.()
    } catch (error) {
        
        errorCb?.()
    }
    finalCb?.()

}

export const updateStaffAttendance = async (
    id: string,
    payload: Pick<AttendanceType, "status" | "remarks">,
    successCb?: () => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {

    try {
        await updateDoc(doc(db, "attendances", id),
            payload
        )
        successCb?.()
    } catch (error) {
        errorCb?.()
    }
    finalCb?.()

}