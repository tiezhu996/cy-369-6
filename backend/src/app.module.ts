import { Module } from "@nestjs/common";
import { OverviewController } from "./overview/overview.controller";
import { OverviewService } from "./overview/overview.service";
import { BookingController } from "./booking/booking.controller";
import { BookingService } from "./booking/booking.service";
import { AppLogger } from "./common/app.logger";

@Module({
  controllers: [OverviewController, BookingController],
  providers: [OverviewService, BookingService, AppLogger],
})
export class AppModule {}
