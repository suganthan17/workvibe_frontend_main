import React, { useEffect, useState } from "react";
import SidebarSeeker from "../../components/SidebarSeeker";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAppliedJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/application/my`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Server not ready");

        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();

    const timeout = setTimeout(() => {
      controller.abort();
      setError(true);
      setLoading(false);
    }, 25000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "Hired":
        return "bg-green-50 text-green-700";
      case "Rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarSeeker />

      <main className="flex-1 px-12 py-10">
        <h1 className="text-3xl font-bold mb-6">Applied Jobs</h1>

        <div className="max-w-4xl bg-white rounded-2xl border">
          {loading ? (
            <div className="p-10 text-center">
              Backend waking up… please wait
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-10">No applications found.</div>
          ) : (
            applications.map((app, i) => (
              <div
                key={app._id}
                className={`p-6 flex justify-between ${
                  i !== applications.length - 1 && "border-b"
                }`}
              >
                <div>
                  <h2 className="font-semibold">{app.jobId?.jobTitle}</h2>
                  <p className="text-sm text-gray-500">{app.jobId?.location}</p>
                </div>

                <div className="flex items-center gap-6">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  {/* ✅ CORRECT DOWNLOAD */}
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AppliedJobs;
