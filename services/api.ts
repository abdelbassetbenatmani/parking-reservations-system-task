import Cookies from "js-cookie";

const BASE_URL = "http://localhost:3000/api/v1";

export async function loginApi({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json();
}

export async function getGate(gateId: string) {
  const res = await fetch(`${BASE_URL}/master/gates`);
  if (!res.ok) throw new Error("Failed to fetch gates");
  const gates = await res.json();
  return gates.find((g: any) => g.id === gateId);
}

export async function getZones(gateId: string) {
  const res = await fetch(`${BASE_URL}/master/zones?gateId=${gateId}`);
  if (!res.ok) throw new Error("Failed to fetch zones");
  return res.json();
}

export async function checkinVisitor(gateId: string, zoneId: string) {
  const res = await fetch(`${BASE_URL}/tickets/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gateId, zoneId, type: "visitor" }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getSubscription(subscriptionId: string) {
  const res = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function checkinSubscriber(
  gateId: string,
  zoneId: string,
  subscriptionId: string
) {
  const res = await fetch(`${BASE_URL}/tickets/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gateId,
      zoneId,
      type: "subscriber",
      subscriptionId,
    }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getEmployees() {
  const token = Cookies.get("token");
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createEmployee(data: {
  username: string;
  password: string;
  role: string;
}) {
  const token = Cookies.get("token");
  const res = await fetch(`${BASE_URL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getParkingState(token: string) {
  const res = await fetch(`${BASE_URL}/admin/reports/parking-state`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/master/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function setZoneOpen(
  zoneId: string,
  open: boolean,
  token: string
) {
  const res = await fetch(`${BASE_URL}/admin/zones/${zoneId}/open`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ open }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateCategoryRates(
  categoryId: string,
  rates: { rateNormal: number; rateSpecial: number },
  token: string
) {
  const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rates),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function addRushHour(
  data: { weekDay: number; from: string; to: string },
  token: string
) {
  const res = await fetch(`${BASE_URL}/admin/rush-hours`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function addVacation(
  data: { name: string; from: string; to: string },
  token: string
) {
  const res = await fetch(`${BASE_URL}/admin/vacations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getTicket(ticketId: string) {
  const res = await fetch(`${BASE_URL}/tickets/${ticketId}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function checkoutTicket(
  ticketId: string,
  forceConvertToVisitor = false
) {
  const res = await fetch(`${BASE_URL}/tickets/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId, forceConvertToVisitor }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
