import React, { useEffect, useState } from "react";
import SidebarSeeker from "../../components/SidebarSeeker";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/application/my`, {
          credentials: "include",
        });

        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all the jobs you have applied for.
          </p>
        </div>

        {/* List Container */}
        <div className="max-w-4xl bg-white rounded-2xl border border-gray-200">
          {loading ? (
            <div className="px-6 py-8 text-gray-500">Loading applications…</div>
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
                {/* Left */}
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900">
                    {app.jobId?.jobTitle}
                  </h2>
                  <p className="text-sm text-gray-500">{app.jobId?.location}</p>
                  <p className="text-xs text-gray-400">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                    View resume
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
