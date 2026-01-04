import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/SidebarRecruiter";
import { SquarePenIcon, CheckCheck, User, Upload } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecruiterProfile = () => {
  const [logo, setLogo] = useState(null);

  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    email: "",
    location: "",
    website: "",
  });

  const [editFlags, setEditFlags] = useState({
    companyInfo: false,
    logo: false,
  });

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/recruiter/profile`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setCompanyInfo({
          name: data.companyInfo?.name || "",
          email: data.basicInfo?.email || "",
          location: data.companyInfo?.location || "",
          website: data.companyInfo?.website || "",
        });

        setLogo(data.companyInfo?.logo || null);
      } catch {
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  /* ================= PREVIEW CLEANUP ================= */
  useEffect(() => {
    if (logo instanceof File) {
      const preview = URL.createObjectURL(logo);
      return () => URL.revokeObjectURL(preview);
    }
  }, [logo]);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "companyInfo",
        JSON.stringify({
          name: companyInfo.name,
          location: companyInfo.location,
          website: companyInfo.website,
        })
      );

      if (logo instanceof File) {
        formData.append("file", logo);
      }

      const res = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();

      setCompanyInfo({
        name: updated.companyInfo.name,
        email: updated.basicInfo.email,
        location: updated.companyInfo.location,
        website: updated.companyInfo.website,
      });

      setLogo(updated.companyInfo.logo);
      setEditFlags({ companyInfo: false, logo: false });

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  const isCompanyIncomplete = !companyInfo.name || !companyInfo.email;

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarRecruiter />

      <main className="flex-1 px-10 py-8">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your company information.
          </p>
        </div>

        {/* WARNING */}
        {isCompanyIncomplete && (
          <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 px-6 py-4 text-sm text-yellow-800">
            <span className="font-semibold">
              ⚠️ Complete your company profile
            </span>{" "}
            to access job posting and applicants.
          </div>
        )}

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {logo ? (
                  <img
                    src={
                      typeof logo === "string"
                        ? logo
                        : URL.createObjectURL(logo)
                    }
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {companyInfo.name || "Company Name"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {companyInfo.email || "Company Email"}
                </p>
              </div>
            </div>

            {editFlags.logo ? (
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm text-indigo-600 cursor-pointer hover:underline">
                  <Upload size={16} />
                  Change logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files[0])}
                  />
                </label>

                <button
                  onClick={saveProfile}
                  className="text-green-600 cursor-pointer hover:scale-110 transition"
                >
                  <CheckCheck size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditFlags((p) => ({ ...p, logo: true }))}
                className="text-indigo-600 cursor-pointer hover:scale-110 transition"
              >
                <SquarePenIcon size={18} />
              </button>
            )}
          </div>
        </div>

        {/* COMPANY INFORMATION */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-900">Company Information</h2>

            <button
              onClick={() =>
                editFlags.companyInfo
                  ? saveProfile()
                  : setEditFlags((p) => ({ ...p, companyInfo: true }))
              }
              className="text-indigo-600 cursor-pointer hover:scale-110 transition"
            >
              {editFlags.companyInfo ? (
                <CheckCheck size={18} />
              ) : (
                <SquarePenIcon size={16} />
              )}
            </button>
          </div>

          {editFlags.companyInfo ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                className={inputClass}
                placeholder="Company name"
                value={companyInfo.name}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, name: e.target.value })
                }
              />

              <input
                className={inputClass}
                value={companyInfo.email}
                disabled
                title="Email cannot be changed"
              />

              <input
                className={inputClass}
                placeholder="Location"
                value={companyInfo.location}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, location: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Website"
                value={companyInfo.website}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, website: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 text-sm">
              {[
                ["Company Name", companyInfo.name],
                ["Email", companyInfo.email],
                ["Location", companyInfo.location],
                ["Website", companyInfo.website],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500">{label}</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecruiterProfile;
