export type Staff={
    id:string,
    name:string,
    email:string,
    joiningDate:string,
    role:string
}

export type AttendanceStatus = 'present' | 'absent' | 'leave'

export type CalendarEvent = {
  id: string
  title: string
  start: string
  backgroundColor: string
  extendedProps: {
    staffId: string
    status: AttendanceStatus
    remark?: string
  }
}