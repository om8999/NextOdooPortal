export type MeResponse = {
  uid: number;
  login: string;
  name: string;
  is_admin: boolean;
};

export async function getMe(): Promise<MeResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  const res = await fetch("http://127.0.0.1:9000/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function getAllUsers() {
  const token = localStorage.getItem("token");
  console.log("Token----------------->",token)
  const res = await fetch("http://127.0.0.1:9000/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Forbidden");
  return res.json();
}

export async function deleteUser(
  userId: number,
  login: string,
  password: string
) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://127.0.0.1:9000/admin/delete-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, login, password }),
  });

  if (!res.ok) throw new Error("Delete failed");
}

export async function changeUserPassword(
  userId: number,
  newPassword: string
) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://127.0.0.1:9000/admin/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      new_password: newPassword,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to change password");
  }

  return res.json();
}
