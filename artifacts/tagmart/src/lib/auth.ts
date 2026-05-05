export function getAuthToken(): string | null {
  return localStorage.getItem("tagmart_token");
}

export function getAuthUser() {
  const u = localStorage.getItem("tagmart_user");
  return u ? JSON.parse(u) : null;
}

export function setAuth(token: string, user: object) {
  localStorage.setItem("tagmart_token", token);
  localStorage.setItem("tagmart_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("tagmart_token");
  localStorage.removeItem("tagmart_user");
}
