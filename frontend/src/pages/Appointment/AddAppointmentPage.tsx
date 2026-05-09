import React from 'react'
import AddAppointment from '../../components/Appointment/AddAppointment'
function AddAppointmentPage()
{
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 bg-neutral-100 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        <AddAppointment />
      </div>
    </div>
  )
}

export default AddAppointmentPage
