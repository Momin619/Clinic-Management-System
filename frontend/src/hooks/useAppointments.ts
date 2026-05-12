import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";

export const useAppointments = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  // ─────────────────────────────
  // FETCH DATA
  // ─────────────────────────────
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/appointments", {
        params: filters,
      });

      setData(res.data.result.appointments);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────
  // AUTO FETCH
  // ─────────────────────────────
  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  return {
    data,
    pagination,
    loading,
    filters,
    setFilters,
  };
};
