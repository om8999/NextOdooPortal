export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("odoo_user");
}
