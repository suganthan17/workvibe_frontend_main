import React, { useEffect, useState } from "react";
import { Blend, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { RecruiterSidebar } from "../data/data";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SidebarRecruiter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/recruiter/profile`, {
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Failed to load recruiter profile", { duration: 3000 });
          return;
        }
        const data = await res.json();
        setUser({
          name:
            data.basicInfo?.fullName ||
            data.basicInfo?.name ||
            data.info?.name ||
            "Recruiter",
          email:
            data.basicInfo?.email ||
            data.info?.email ||
            data.companyInfo?.contactEmail ||
            "email@example.com",
          profilePic:
            data.companyInfo?.logo || data.profilePic || data.logo || null,
        });
      } catch (err) {
        toast.error("Failed to load recruiter profile", { duration: 3000 });
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      localStorage.clear();
      toast.success("Logged out successfully", { duration: 3000 });
      setTimeout(() => navigate("/login"), 400);
    } catch {
      toast.error("Logout failed", { duration: 3000 });
    }
  };

  return (
    <aside className="w-72 min-h-screen p-6 bg-white border-r border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-sky-50">
          <Blend size={28} className="text-indigo-500" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-gray-800 leading-tight">
            ᗯOᖇK<span className="text-indigo-500">ᐯIᗷE</span>
          </h1>
          <p className="text-xs text-gray-400">Recruiter</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-2xl mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-md bg-gray-100 flex items-center justify-center">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(96,165,250,0.95), rgba(124,58,237,0.95))",
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "R"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">
              {user.name || "Recruiter"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email || "email@example.com"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {RecruiterSidebar.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center cursor-pointer gap-3 px-3 py-2 rounded-lg text-left transition ${
                    active
                      ? "bg-indigo-50 ring-1 ring-indigo-100 text-indigo-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`${
                      active ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {item.icon && <item.icon size={18} />}
                  </span>
                  <span
                    className={`text-sm ${
                      active ? "font-medium" : "font-normal"
                    } text-gray-700`}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg border border-transparent bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SidebarRecruiter;
