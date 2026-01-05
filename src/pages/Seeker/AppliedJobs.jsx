import React, { useEffect, useState } from "react";
import SidebarSeeker from "../../components/SidebarSeeker";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/application/my`, {
          credentials: "include",
        });
        const data = await res.json();
        setApplications(data.applications || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarSeeker />
      <main className="flex-1 px-12 py-10">
        <h1 className="text-3xl font-bold mb-6">Applied Jobs</h1>

        <div className="max-w-4xl bg-white rounded-2xl border">
          {loading ? (
            <div className="p-10 text-center">Loading…</div>
          ) : error ? (
            <div className="p-10 text-center">Error loading data</div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="p-6 flex justify-between border-b"
              >
                <div>
                  <h2 className="font-semibold">{app.jobId?.jobTitle}</h2>
                  <p className="text-sm text-gray-500">
                    {app.jobId?.location}
                  </p>
                </div>

                <a
                  href={`${BASE_URL}/api/application/download/${app._id}`}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Download Resume
                </a>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AppliedJobs;
