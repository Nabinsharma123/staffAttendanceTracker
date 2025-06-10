import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { AttendanceType, LoginFormValidationType, StaffType } from "./types";
import { auth, db } from "./firebase";
import { handleRequest } from "./helpers";
import { signInWithEmailAndPassword } from "firebase/auth";


export const getStaffs = async (
    errorCb?: () => void
): Promise<StaffType[]> => {
    const fetchStaffsQuery = query(collection(db, "staffs"))

    const { data, error } = await handleRequest(getDocs(fetchStaffsQuery))

    if (error) {
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

export const getAttendances = async (
    errorCb?: () => void
): Promise<AttendanceType[]> => {
    const fetchAttendancesQuery = query(collection(db, "attendances"))

    const { data, error } = await handleRequest(getDocs(fetchAttendancesQuery))

    if (error) {
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


export const getStaffAttendances = async (
    staffId: string,
    errorCb?: () => void
): Promise<AttendanceType[]> => {
    const fetchStaffAttendancesQuery = query(collection(db, "attendances"), where("staffId", "==", staffId))

    const { data, error } = await handleRequest(getDocs(fetchStaffAttendancesQuery))

    if (error) {
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
    successCb?: (docId: string) => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {


    const { data, error } = await handleRequest(addDoc(collection(db, "attendances"), payload))
    if (error) {
        errorCb?.()
        finalCb?.()
        return
    }

    successCb?.(data?.id as string)
    finalCb?.()

}

export const updateStaffAttendance = async (
    id: string,
    payload: Pick<AttendanceType, "status" | "remarks">,
    successCb?: () => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {
    const { data, error } = await handleRequest(updateDoc(doc(db, "attendances", id),payload))
    if (error) {
        errorCb?.()
        finalCb?.()
        return
    }

    successCb?.()
    finalCb?.()

}


export const createStaff = async (
    payload: Omit<StaffType, "id">,
    successCb?: (docId: string) => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {
    const { data, error } = await handleRequest(addDoc(collection(db, "staffs"), payload))
    if (error) {
        errorCb?.()
        finalCb?.()
        return
    }

    successCb?.(data?.id as string)
    finalCb?.()
}

export const updateStaff = async (
    id: string,
    payload: Omit<StaffType, "id" | "createdAt">,
    successCb?: () => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {
    const { data, error } = await handleRequest(
        updateDoc(doc(db, "staffs", id), payload))
    if (error) {
        errorCb?.()
        finalCb?.()
        return
    }

    successCb?.()
    finalCb?.()
}

export const deleteStaff = async (
    id: string,
    successCb?: () => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {
    const { data, error } = await handleRequest(deleteDoc(doc(db, "staffs", id)))
    if (error) {
        errorCb?.()
        finalCb?.()
        return
    }

    successCb?.()
    finalCb?.()
}


export const logout = async () => {
    await auth.signOut()
}

export const loginUser = async (formData: LoginFormValidationType,
    successCb?: () => void,
    errorCb?: () => void,
    finalCb?: () => void
) => {
    const { data, error } = await handleRequest(signInWithEmailAndPassword(auth, formData?.email, formData?.password))
    if (error) {
        errorCb?.()
        finalCb?.()
        return
    }

    successCb?.()
    finalCb?.()
}