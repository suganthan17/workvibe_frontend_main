import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Briefcase, Building2, MapPin, Clock, Tag, Globe } from "lucide-react";
import ApplyPopup from "../../components/ApplyPopup";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JobDetails({ job: propJob = null }) {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(propJob);
  const [company, setCompany] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const getImageUrl = (path) => {
    if (!path) return null;
    const fixed = path.replace(/\\/g, "/");
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${BASE_URL.replace(/\/$/, "")}/${fixed.replace(/^\//, "")}`;
  };

  // If no job prop was provided, fetch by jobId
  useEffect(() => {
    if (propJob) {
      setJob(propJob);
      setImageFailed(false);
      return;
    }
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/getjob/${jobId}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.job) {
          setJob(data.job);
          setImageFailed(false);
        } else {
          toast.error(data.message || "Failed to fetch job details");
        }
      } catch (err) {
        toast.error(`Server Error: ${err.message}`);
      }
    };

    fetchJob();
  }, [jobId, propJob]);

  useEffect(() => {
    if (!job?.postedBy) return;

    const fetchRecruiterPublicInfo = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/recruiter/profile/public/${job.postedBy}`
        );
        const data = await res.json();

        setContactEmail(data.email || "");
        setCompanyWebsite(data.website || "");
      } catch (err) {
        console.error("Failed to fetch recruiter public info", err);
      }
    };

    fetchRecruiterPublicInfo();
  }, [job]);

  useEffect(() => {
    const checkApplied = async () => {
      const res = await fetch(
        `${BASE_URL}/api/application/has-applied/${jobId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setHasApplied(data.applied);
    };
    checkApplied();
  }, [jobId]);

  useEffect(() => {
    if (!job) return;

    setCompany({
      companyInfo: {
        name: job.companyName,
        location: job.location,
        logo: job.companyLogo,
        website: "",
      },
    });
  }, [job]);

  // Loading state
  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg bg-gradient-to-b from-gray-50 to-white">
        Loading job details...
      </div>
    );
  }

  // poster image resolution and fallback
  const posterPath =
    job.companyLogo ||
    company?.companyInfo?.logo ||
    job.posterProfileImage ||
    null;

  const posterImage = !imageFailed ? getImageUrl(posterPath) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Toaster position="top-right" />

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:shadow-sm rounded-lg text-sm text-black font-semibold transition"
        >
          ← Back to Jobs
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md mb-6">
        <div
          className="h-36 w-full"
          style={{
            background: `
      linear-gradient(90deg, #141E30 0%, #243B55 100%),
      linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
    `,
            backgroundSize: "cover, 28px 28px, 28px 28px",
            backgroundBlendMode: "overlay",
          }}
        />

        <div className="bg-white p-6 -mt-10 rounded-b-2xl border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              {posterImage ? (
                <img
                  src={posterImage}
                  alt={`${job.companyName || "Company"} logo`}
                  className="w-16 h-16 rounded-lg object-cover bg-white shadow-inner"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white shadow-inner flex items-center justify-center text-2xl font-bold text-gray-800">
                  {job.companyName?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {job.jobTitle || job.title || "Job Title"}
                </h1>
                <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2">
                    <Briefcase size={16} /> {job.employmentType || "Full Time"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} /> {job.location || "Remote"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Tag size={16} /> {job.jobCategory || "General"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={hasApplied}
                onClick={() => setShowPopup(true)}
                className={`px-5 py-2 rounded-full font-semibold shadow ${
                  hasApplied
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-black to-blue-900 cursor-pointer text-white"
                }`}
              >
                {hasApplied ? "Applied" : "Apply"}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span>
                {job.createdAt ? new Date(job.createdAt).toLocaleString() : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" />
              <span>{company?.companyInfo?.name || job.companyName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <span>{company?.companyInfo?.location || job.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              About the job
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {job.jobDescription ||
                job.description ||
                "No description provided."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Responsibilities
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              {(
                (job.responsibilities &&
                  job.responsibilities.split("\n").filter(Boolean)) ||
                (job.responsibility &&
                  job.responsibility.split("\n").filter(Boolean))
              )?.map((r, i) => <li key={i}>{r}</li>) || (
                <>
                  <li>Deliver the project as per the baseline scope.</li>
                  <li>Maintain quality delivery within the given timeline.</li>
                  <li>Ensure smooth communication with stakeholders.</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Requirements
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {job.requirements || "No requirements listed."}
            </p>
          </div>
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div>
              <div className="text-xs text-gray-500">Avg. salary</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">
                ₹{job.salaryMin ?? "—"} - ₹{job.salaryMax ?? "—"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {job.employmentType || "Employment"} •{" "}
                {job.location || "Location"}
              </div>
            </div>
            <hr className="my-4 border-gray-100" />
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <span className="font-medium">Industry:</span>{" "}
                {job.industry || "Software and hardware"}
              </li>
              <li>
                <span className="font-medium">Employment:</span>{" "}
                {job.employmentType || "Full-time"}
              </li>
              <li>
                <span className="font-medium">Category:</span>{" "}
                {job.jobCategory || "Engineering"}
              </li>
              <li>
                <span className="font-medium">Contact:</span>{" "}
                {contactEmail || "Not provided"}
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-md font-semibold text-gray-800 mb-3">
              About company
            </h4>
            <div className="flex items-center gap-3 mb-3">
              {posterImage ? (
                <img
                  src={posterImage}
                  alt={`${job.companyName || "Company"} logo`}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-800 font-semibold">
                  {job.companyName?.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-medium">
                  {company?.companyInfo?.name || job.companyName}
                </div>
                <div className="text-xs text-gray-500">
                  {company?.companyInfo?.location}
                </div>
              </div>
            </div>

            {companyWebsite && (
              <a
                href={companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 text-sm"
              >
                <Globe size={14} /> {companyWebsite}
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Apply popup (propagates job._id if available) */}
      {showPopup && (
        <ApplyPopup
          jobId={job._id || job.id || jobId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default JobDetails;
