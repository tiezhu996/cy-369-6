export type BookingStatus = "pending" | "confirmed" | "checkin_pending" | "completed" | "cancelled";
export type SiteType = "tent" | "rv" | "cabin";

export interface Booking {
  id: string;
  bookingNo: string;
  customerName: string;
  customerPhone: string;
  siteType: SiteType;
  siteName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestCount: number;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  remark: string;
}

export interface BookingListResponse {
  list: Booking[];
  total: number;
  statusLabels: Record<string, string>;
  siteTypeLabels: Record<string, string>;
}

export interface BookingStatisticsResponse {
  total: number;
  pending: number;
  confirmed: number;
  checkinPending: number;
  completed: number;
  totalAmount: number;
  statusLabels: Record<string, string>;
  siteTypeLabels: Record<string, string>;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}
