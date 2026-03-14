import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/SidebarRecruiter";
import { MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecruiterHome = () => {
  const [jobsPostedCount, setJobsPostedCount] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalHired, setTotalHired] = useState(0);

  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/getjobs`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.jobs) {
          setJobsPostedCount(data.jobs.length);
          localStorage.setItem("jobsCount", data.jobs.length);
        }
      } catch {
        setJobsPostedCount(0);
      }
    };
    fetchJobCount();
  }, []);

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/application/recruiter`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.applications) {
          setTotalApplicants(data.applications.length);

          const hiredCount = data.applications.filter(
            (app) => app.status === "Hired"
          ).length;

          setTotalHired(hiredCount);
        }
      } catch {
        setTotalApplicants(0);
        setTotalHired(0);
      }
    };
    fetchApplicantsData();
  }, []);

  const cardClass =
    "p-6 rounded-2xl shadow-md flex flex-col justify-between w-64";
  const iconContainerClass =
    "p-2 rounded-full flex items-center justify-center";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-100">
      <SidebarRecruiter />

      <div className="flex-1 p-10">
        <div className="flex flex-col mb-5 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 pb-2">Dashboard</h1>
          <p className="text-sm text-gray-600 mb-5">
            Overview of your job postings and applicants.
          </p>
        </div>

        <div className="flex space-x-6 w-full">
          <div
            className={`${cardClass} bg-gradient-to-br from-blue-600 to-violet-400 text-white`}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-sm font-medium">Jobs Posted</h2>
              <Link to="/jobsposted">
                <div className={`${iconContainerClass} bg-white/20`}>
                  <MoveUpRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>
            <p className="text-5xl font-bold mt-3">{jobsPostedCount}</p>
          </div>

          <div
            className={`${cardClass} bg-white text-black border border-gray-200`}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-sm font-medium">Total Applicants</h2>
              <Link to="/applicants">
                <div className={`${iconContainerClass} bg-black`}>
                  <MoveUpRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>
            <p className="text-5xl font-bold mt-3">{totalApplicants}</p>
          </div>

          <div
            className={`${cardClass} bg-gradient-to-br from-green-500 to-emerald-400 text-white`}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-sm font-medium">Total Hired</h2>
              <Link to="/applicants">
                <div className={`${iconContainerClass} bg-white/20`}>
                  <MoveUpRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>
            <p className="text-5xl font-bold mt-3">{totalHired}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterHome;
