import React, { useEffect, useState } from "react";
import SidebarRecruiter from "../../components/SidebarRecruiter";
import { User, FileText, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Applicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/application/recruiter`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch applicants");
        setApplications(data.applications || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${BASE_URL}/api/application/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update status");

      setApplications((apps) =>
        apps.map((a) => (a._id === id ? { ...a, status } : a))
      );

      toast.success(`Application marked as ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 🔑 Google Docs Viewer (ONLY WAY TO PREVIEW Cloudinary RAW files)
  const getViewUrl = (url) =>
    `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarRecruiter />

      <main className="flex-1 px-12 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Applicants
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage candidates who applied for your jobs.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading applicants…</p>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-gray-600">
            No applications yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 transition"
              >
                {/* Applicant Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <User size={20} className="text-indigo-600" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {app.userId?.Username || "Unknown Applicant"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {app.userId?.Email || "No email"}
                    </p>
                  </div>
                </div>

                {/* Job + Status */}
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <span className="font-medium text-gray-800">
                      Job:
                    </span>{" "}
                    {app.jobId?.jobTitle || "N/A"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Status:
                    </span>{" "}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === "Hired"
                          ? "bg-green-50 text-green-700"
                          : app.status === "Rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {app.status || "Applied"}
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6">
                  {app.resumeUrl ? (
                    <a
                      href={getViewUrl(app.resumeUrl)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
                    >
                      <FileText size={16} />
                      View resume
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">
                      No resume
                    </span>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(app._id, "Hired")}
                      className="p-2 rounded-full bg-green-50 hover:bg-green-100"
                      title="Mark as hired"
                    >
                      <CheckCircle size={18} className="text-green-600" />
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "Rejected")}
                      className="p-2 rounded-full bg-red-50 hover:bg-red-100"
                      title="Reject applicant"
                    >
                      <XCircle size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
