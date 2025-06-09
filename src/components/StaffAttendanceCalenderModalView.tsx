'use client'

import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { EventClickArg } from '@fullcalendar/core'
import { AttendanceType, CalendarEventType } from '@/lib/types'
import FreeFormModal from './FreeFormModal'
import { prepareCalenderEventData } from '@/lib/helpers'



type ComponentPropsType = {
  attendances: AttendanceType[]
  onDateClick?: (arg: DateClickArg) => void
  onEventClick?: (arg: EventClickArg) => void
  close?:()=>void
}

const StaffAttendanceCalenderModalView = (props: ComponentPropsType) => {

  const {
    attendances=[],
    onDateClick,
    onEventClick,
    close
  } = props

  const [events, setEvents] = useState<CalendarEventType[]>([]);

  useEffect(()=>{
    setEvents(attendances?.map(prepareCalenderEventData))
  },[attendances])


  return (
    <FreeFormModal className='min-w-[80vw] !h-[90vh]' title='title' close={close}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        height="100%"
        
      />

    </FreeFormModal>
  )
}

export default StaffAttendanceCalenderModalView
