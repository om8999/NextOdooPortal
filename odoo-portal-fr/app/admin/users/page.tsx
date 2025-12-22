"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, getMe, deleteUser } from "@/app/lib/api";
import { logout } from "@/app/lib/auth";

type User = {
  id: number;
  name: string;
  login: string;
  active: boolean;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [mode, setMode] = useState<"delete" | "password" | null>(null);
  
  useEffect(() => {
    async function init() {
      try {
        const me = await getMe();
        if (!me.is_admin) {
          router.replace("/dashboard");
          return;
        }
        setCurrentUser(me);
        const users = await getAllUsers();
        setUsers(users);
      } catch {
        setError("Access denied");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-lg font-semibold">Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-red-200 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center">
      {/* Card */}
      <div className="relative w-full max-w-5xl p-6 rounded-2xl bg-white/20 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-white">Admin – Users</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-white/30 rounded-lg">
            <thead className="bg-white/30">
              <tr>
                {["ID", "Name", "Login", "Active", "Actions"].map((th) => (
                  <th
                    key={th}
                    className="border-b border-white/30 px-4 py-3 text-left text-sm font-semibold text-white"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white/10" : "bg-white/5"
                  } hover:bg-white/20 transition`}
                >
                  <td className="border-b border-white/20 px-4 py-2 text-white">{u.id}</td>
                  <td className="border-b border-white/20 px-4 py-2 text-white">{u.name}</td>
                  <td className="border-b border-white/20 px-4 py-2 text-white">{u.login}</td>
                  <td className="border-b border-white/20 px-4 py-2 text-center text-white">
                    {u.active ? "✅" : "❌"}
                  </td>
                  <td className="border-b border-white/20 px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setMode("password");
                        setNewPassword("");
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Change Password
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setMode("delete");
                        setPassword("");
                      }}
                      disabled={u.login === currentUser?.login}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/90 text-gray-800 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">

            {/* DELETE MODE */}
            {mode === "delete" && (
              <>
                <h2 className="text-2xl font-bold mb-2">Confirm Delete</h2>
                <p className="text-gray-600 mb-4">
                  Enter password for <b>{selectedUser.login}</b> to confirm deletion.
                </p>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                  placeholder="User password"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!password) return;
                      try {
                        setDeleting(true);
                        await deleteUser(
                          selectedUser.id,
                          selectedUser.login,
                          password
                        );
                        setUsers(await getAllUsers());
                        setSelectedUser(null);
                      } catch {
                        alert("Password verification failed");
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}

            {/* PASSWORD MODE */}
            {mode === "password" && (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Change Password
                </h2>

                <p className="text-gray-600 mb-2">
                  User: <b>{selectedUser.login}</b>
                </p>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                  placeholder="New password"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!newPassword) return;
                      try {
                        setChangingPassword(true);
                        await fetch("http://127.0.0.1:9000/admin/change-password", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify({
                            user_id: selectedUser.id,
                            new_password: newPassword,
                          }),
                        });
                        alert("Password changed successfully");
                        setSelectedUser(null);
                      } catch {
                        alert("Failed to change password");
                      } finally {
                        setChangingPassword(false);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.2s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
