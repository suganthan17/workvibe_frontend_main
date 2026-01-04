import React, { useState, useEffect } from "react";
import SidebarSeeker from "../../components/SidebarSeeker";
import { SquarePenIcon, CheckCheck, User, Upload } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SeekerProfile = () => {
  const [profilePic, setProfilePic] = useState(null);

  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [linkedin, setLinkedin] = useState("");

  const [editFlags, setEditFlags] = useState({
    basicInfo: false,
    locationInfo: false,
    linkedin: false,
    profilePic: false,
  });

  const inputStyle =
    "border border-gray-200 px-4 py-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white transition";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/seeker/profile`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setBasicInfo(data.basicInfo || basicInfo);

          setLinkedin(data.linkedin || "");
          setProfilePic(data.profilePic || null);
        }
      } catch {
        toast.error("Error fetching profile");
      }
    };
    fetchProfile();
  }, []);

  const saveSection = async (section) => {
    try {
      const formData = new FormData();

      if (section === "profilePic" && profilePic instanceof File)
        formData.append("file", profilePic);

      if (section === "basicInfo")
        formData.append("basicInfo", JSON.stringify(basicInfo));

      if (section === "linkedin") formData.append("linkedin", linkedin);

      const res = await fetch(`${BASE_URL}/api/seeker/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        toast.success("Profile updated");
        setEditFlags((p) => ({ ...p, [section]: false }));
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarSeeker />

      <main className="flex-1 px-12 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal details and keep your profile up to date.
          </p>
        </div>
        {!(basicInfo.fullName && basicInfo.phone) && (
          <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 px-6 py-4 text-sm text-yellow-800">
            <span className="font-semibold">
              ⚠️ Complete your Personal Information
            </span>{" "}
            to continue using the platform.
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {profilePic ? (
                  <img
                    src={
                      typeof profilePic === "string"
                        ? profilePic
                        : URL.createObjectURL(profilePic)
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <User size={36} />
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {basicInfo.fullName || "Your Name"}
                </h2>
                <p className="text-sm text-gray-600">
                  {basicInfo.email || "your@email.com"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {basicInfo.phone || "Phone number"}
                </p>
              </div>
            </div>

            {editFlags.profilePic ? (
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 cursor-pointer">
                  <Upload size={16} />
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />
                </label>
                <button
                  onClick={() => saveSection("profilePic")}
                  className="text-green-600 cursor-pointer"
                >
                  <CheckCheck size={24} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditFlags({ ...editFlags, profilePic: true })}
                className="text-gray-700 hover:text-indigo-700 cursor-pointer"
              >
                <SquarePenIcon size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
            <button
              onClick={() =>
                editFlags.basicInfo
                  ? saveSection("basicInfo")
                  : setEditFlags({ ...editFlags, basicInfo: true })
              }
              className="cursor-pointer text-indigo-700"
            >
              {editFlags.basicInfo ? (
                <CheckCheck size={22} />
              ) : (
                <SquarePenIcon size={18} />
              )}
            </button>
          </div>

          {editFlags.basicInfo ? (
            /* EDIT MODE */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={basicInfo.fullName}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, fullName: e.target.value })
                }
                className={inputStyle}
              />

              <input
                type="email"
                placeholder="Email"
                value={basicInfo.email}
                disabled
                className={`${inputStyle} bg-gray-100 cursor-not-allowed`}
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={basicInfo.phone}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, phone: e.target.value })
                }
                className={inputStyle}
              />

              <input
                type="date"
                value={basicInfo.dob}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, dob: e.target.value })
                }
                className={inputStyle}
              />
            </div>
          ) : (
            /* VIEW MODE */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="font-medium text-gray-800">
                  {basicInfo.fullName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium text-gray-800">
                  {basicInfo.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Mobile Number</p>
                <p className="font-medium text-gray-800">
                  {basicInfo.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Date of Birth</p>
                <p className="font-medium text-gray-800">
                  {basicInfo.dob || "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LinkedIn */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">LinkedIn</h2>
            <button
              onClick={() =>
                editFlags.linkedin
                  ? saveSection("linkedin")
                  : setEditFlags({ ...editFlags, linkedin: true })
              }
              className="cursor-pointer text-indigo-700"
            >
              {editFlags.linkedin ? (
                <CheckCheck size={22} />
              ) : (
                <SquarePenIcon size={18} />
              )}
            </button>
          </div>

          {editFlags.linkedin ? (
            <input
              placeholder="LinkedIn profile URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={inputStyle}
            />
          ) : (
            <p className="text-sm text-gray-700">
              {linkedin || "Add your LinkedIn profile"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeekerProfile;
