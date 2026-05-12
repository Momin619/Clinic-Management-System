import React from 'react'
import Appointments from '../../components/Appointment/Appointment/Appointments'
function AppointmentsPage()
{
  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4 bg-neutral-100 dark:bg-zinc-900">
      <Appointments />
    </div>
  )
}

export default AppointmentsPage
