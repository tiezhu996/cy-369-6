import { Injectable } from "@nestjs/common";
import { bookingData, Booking, statusLabels, siteTypeLabels } from "./booking.data";

export interface BookingListQuery {
  status?: string;
  siteType?: string;
}

@Injectable()
export class BookingService {
  private bookings: Booking[] = [...bookingData];

  getBookings(query: BookingListQuery = {}) {
    let result = [...this.bookings];

    if (query.status) {
      result = result.filter((b) => b.status === query.status);
    }

    if (query.siteType) {
      result = result.filter((b) => b.siteType === query.siteType);
    }

    return {
      list: result,
      total: result.length,
      statusLabels,
      siteTypeLabels,
    };
  }

  getBooking(id: string) {
    return this.bookings.find((b) => b.id === id);
  }

  updateBookingStatus(id: string, status: Booking["status"]) {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return null;
    }
    this.bookings[index] = { ...this.bookings[index], status };
    return this.bookings[index];
  }

  getStatistics() {
    const total = this.bookings.length;
    const pending = this.bookings.filter((b) => b.status === "pending").length;
    const confirmed = this.bookings.filter((b) => b.status === "confirmed").length;
    const checkinPending = this.bookings.filter((b) => b.status === "checkin_pending").length;
    const completed = this.bookings.filter((b) => b.status === "completed").length;
    const totalAmount = this.bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      total,
      pending,
      confirmed,
      checkinPending,
      completed,
      totalAmount,
      statusLabels,
      siteTypeLabels,
    };
  }
}
