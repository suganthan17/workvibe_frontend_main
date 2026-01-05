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

        if (!res.ok) {
          throw new Error("Server not ready");
        }

        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Applied jobs fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false); // 🔴 ALWAYS stop loading
      }
    };

    fetchAppliedJobs();

    // ⏱ Stop waiting after 25 seconds (Render cold start safety)
    const timeout = setTimeout(() => {
      controller.abort();
      setLoading(false);
      setError(true);
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

  const downloadResume = (url) => {
    if (!url) return;
    window.location.href =
      url.includes("?")
        ? `${url}&response-content-disposition=attachment`
        : `${url}?response-content-disposition=attachment`;
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarSeeker />

      <main className="flex-1 px-12 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all the jobs you have applied for.
          </p>
        </div>

        <div className="max-w-4xl bg-white rounded-2xl border border-gray-200">
          {loading ? (
            <div className="px-6 py-10 text-center text-gray-600">
              <p className="font-medium">Loading applications…</p>
              <p className="text-sm text-gray-400 mt-2">
                Backend is waking up (free-tier deployment).  
                This may take up to a minute.
              </p>
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-gray-600">
              <p className="font-medium">Server is taking longer than expected.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="px-6 py-10 text-gray-600">
              You haven’t applied for any jobs yet.
            </div>
          ) : (
            applications.map((app, index) => (
              <div
                key={app._id}
                className={`px-6 py-5 flex items-center justify-between ${
                  index !== applications.length - 1
                    ? "border-b border-gray-200"
                    : ""
                } hover:bg-gray-50 transition`}
              >
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900">
                    {app.jobId?.jobTitle}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {app.jobId?.location}
                  </p>
                  <p className="text-xs text-gray-400">
                    Applied on{" "}
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  <button
                    onClick={() => downloadResume(app.resumeUrl)}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Download Resume
                  </button>
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
