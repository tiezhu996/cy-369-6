import { Controller, Get, Put, Query, Param, Body } from "@nestjs/common";
import { BookingService, BookingListQuery } from "./booking.service";
import type { Booking } from "./booking.data";

interface UpdateStatusDto {
  status: Booking["status"];
}

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get("bookings/statistics")
  bookingStats() {
    return this.bookingService.getStatistics();
  }

  @Get("api/bookings/statistics")
  apiBookingStats() {
    return this.bookingService.getStatistics();
  }

  @Get("bookings")
  bookings(@Query() query: BookingListQuery) {
    return this.bookingService.getBookings(query);
  }

  @Get("api/bookings")
  apiBookings(@Query() query: BookingListQuery) {
    return this.bookingService.getBookings(query);
  }

  @Get("bookings/:id")
  bookingDetail(@Param("id") id: string) {
    return this.bookingService.getBooking(id);
  }

  @Get("api/bookings/:id")
  apiBookingDetail(@Param("id") id: string) {
    return this.bookingService.getBooking(id);
  }

  @Put("bookings/:id/status")
  updateStatus(@Param("id") id: string, @Body() body: UpdateStatusDto) {
    return this.bookingService.updateBookingStatus(id, body.status);
  }

  @Put("api/bookings/:id/status")
  apiUpdateStatus(@Param("id") id: string, @Body() body: UpdateStatusDto) {
    return this.bookingService.updateBookingStatus(id, body.status);
  }
}
