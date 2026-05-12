// AppointmentPage.tsx
import { useEffect, useState } from "react";

import { useDebounce } from "../../../hooks/useDebounce";
import { AppointmentSearch } from "./AppointmentSearch";
import { AppointmentFilters } from "./AppointmentFilters";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentSkeleton } from "./AppointmentSkeleton";
import type { Status, Appointment } from './appointment'
import { Pagination } from "./Pagination";
import { api } from "../../../api/axios";
import { UpdateStatusModal } from './UpdateStatusModal'
export default function Appointments() 
{
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [status, setStatus] = useState<Status>("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const openModal = (appointment: Appointment) =>
  {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const [showModal, setShowModal] = useState(false);
  const handleStatusUpdate = (id: string, status: Status) =>
  {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  // ─────────────────────────────
  // FETCH DATA
  // ─────────────────────────────
  useEffect(() =>
  {
    let ignore = false;

    const fetchAppointments = async () =>
    {
      try
      {
        setLoading(true);

        const res = await api.get(
          `/appointments?status=${status}&search=${debouncedSearch}&page=${page}&limit=10`
        );


        if (!ignore)
        {
          setAppointments(res.data?.result?.appointments ?? []);
          setPages(res.data?.pagination?.pages ?? 1);
        }
      } finally
      {
        if (!ignore) setLoading(false);
      }
    };

    fetchAppointments();

    return () =>
    {
      ignore = true; // prevents outdated responses overwriting new state
    };
  }, [status, debouncedSearch, page]);

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4">

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <AppointmentSearch value={search} onChange={setSearch} />
        <AppointmentFilters status={status} onChange={setStatus} />
      </div>

      {/* LIST */}
      <div className="grid flex-1 gap-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <AppointmentSkeleton key={i} />
          ))
          : appointments.map((a) => (
            <AppointmentCard key={a.id} data={a} onUpdate={() => openModal(a)} />
          ))}
      </div>

      {/* PAGINATION */}
      <div className="py-3 mt-auto bg-white border-t dark:bg-zinc-950">
        {!loading && (
          <Pagination page={page} pages={pages} onChange={setPage} />
        )}
      </div>


      {showModal && selectedAppointment && (
        <UpdateStatusModal
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          onSuccess={handleStatusUpdate}
        />
      )}
    </div>
  );
};