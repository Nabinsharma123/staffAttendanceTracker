'use client'

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { EventClickArg } from '@fullcalendar/core'
import { CalendarEvent } from '@/lib/types'
import FreeFormModal from './FreeFormModal'



type ComponentPropsType = {
  events?: CalendarEvent[]
  onDateClick?: (arg: DateClickArg) => void
  onEventClick?: (arg: EventClickArg) => void
  close?:()=>void
}

const StaffAttendanceCalenderModalView = (props: ComponentPropsType) => {

  const {
    events,
    onDateClick,
    onEventClick,
    close
  } = props


  return (
    <FreeFormModal className='min-w-[80vw]' title='title' close={close}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        height="80vh"
        
      />

    </FreeFormModal>
  )
}

export default StaffAttendanceCalenderModalView
