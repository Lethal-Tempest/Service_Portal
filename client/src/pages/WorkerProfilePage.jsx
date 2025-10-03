// src/pages/WorkerProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import WorkerProfile from "@/components/WorkerProfile";

const WorkerProfilePage = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchWorker = async () => {
      try {
        const { data } = await axios.get(`https://service-portal-1.onrender.com/api/worker/${workerId}`);
        if (!cancelled && data?.success) setWorker(data.worker);
      } catch (e) {
        // optionally show a toast/log
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (workerId) fetchWorker();
    return () => { cancelled = true; };
  }, [workerId]);

  if (loading) return <div className="p-6 text-gray-500">Loading worker...</div>;
  if (!worker) return <div className="p-6 text-gray-500">Worker not found.</div>;

  return <WorkerProfile worker={worker} onEditProfile={() => {}} />;
};

export default WorkerProfilePage;
