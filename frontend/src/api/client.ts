import { API_BASE_URL } from "../constants/app";
import type { OverviewResponse, BookingListResponse, Booking, BookingStatisticsResponse } from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export interface BookingQueryParams {
  status?: string;
  siteType?: string;
}

export async function fetchBookings(params?: BookingQueryParams): Promise<BookingListResponse> {
  const url = new URL(`${API_BASE_URL}/bookings`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Bookings request failed: ${response.status}`);
  }

  return response.json() as Promise<BookingListResponse>;
}

export async function updateBookingStatus(id: string, status: Booking["status"]): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Update booking status failed: ${response.status}`);
  }

  return response.json() as Promise<Booking>;
}

export async function fetchBookingStatistics(): Promise<BookingStatisticsResponse> {
  const response = await fetch(`${API_BASE_URL}/bookings/statistics`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Booking statistics request failed: ${response.status}`);
  }

  return response.json() as Promise<BookingStatisticsResponse>;
}
