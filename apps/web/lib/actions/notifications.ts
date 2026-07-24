"use server";

import { getAuthHeaders } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const API = process.env.INTERNAL_API_URL || "http://api:4000";

export async function getNotifications() {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return [];

    const res = await fetch(`${API}/api/v1/notifications`, {
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "no-store"
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function markAsRead() {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return false;

    const res = await fetch(`${API}/api/v1/notifications/read-all`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" }
    });

    if (res.ok) {
      // We don't have a specific path to revalidate since this is a global component,
      // but revalidating the root will refresh data.
      revalidatePath("/", "layout");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return false;
  }
}
