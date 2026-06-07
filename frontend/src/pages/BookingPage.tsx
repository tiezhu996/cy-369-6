import { useEffect, useState } from "react";
import { Table, Tag, Select, Button, Space, Typography, message, Row, Col, Card } from "antd";
import { ReloadOutlined, CalendarOutlined, UserOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { fetchBookings, updateBookingStatus, fetchBookingStatistics, BookingQueryParams } from "../api/client";
import { localBookings, statusLabels, siteTypeLabels } from "../data/bookings";
import { REQUEST_MESSAGES } from "../constants/messages";
import type { Booking, BookingStatus, BookingStatisticsResponse } from "../types";

const { Title } = Typography;
const { Option } = Select;

const statusColorMap: Record<string, string> = {
  pending: "orange",
  confirmed: "blue",
  checkin_pending: "cyan",
  completed: "green",
  cancelled: "default",
};

const editableStatusMap: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checkin_pending", "cancelled"],
  checkin_pending: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

function createFallbackBookings() {
  return {
    list: localBookings,
    total: localBookings.length,
    statusLabels,
    siteTypeLabels,
  };
}

function createFallbackStatistics(): BookingStatisticsResponse {
  return {
    total: localBookings.length,
    pending: localBookings.filter((b) => b.status === "pending").length,
    confirmed: localBookings.filter((b) => b.status === "confirmed").length,
    checkinPending: localBookings.filter((b) => b.status === "checkin_pending").length,
    completed: localBookings.filter((b) => b.status === "completed").length,
    totalAmount: localBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    statusLabels,
    siteTypeLabels,
  };
}

export function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>(localBookings);
  const [statistics, setStatistics] = useState<BookingStatisticsResponse>(createFallbackStatistics());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [query, setQuery] = useState<BookingQueryParams>({});
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([fetchBookings(query), fetchBookingStatistics()])
      .then(([bookingResult, statsResult]) => {
        let isLive = false;
        const fb = createFallbackBookings();

        if (bookingResult.status === "fulfilled") {
          setBookings(bookingResult.value.list);
          isLive = true;
        } else {
          let filtered = fb.list;
          if (query.status) filtered = filtered.filter((b) => b.status === query.status);
          if (query.siteType) filtered = filtered.filter((b) => b.siteType === query.siteType);
          setBookings(filtered);
        }

        if (statsResult.status === "fulfilled") {
          setStatistics(statsResult.value);
          isLive = true;
        } else {
          setStatistics(createFallbackStatistics());
        }

        setNotice(isLive ? "后端服务已联通，当前展示实时接口数据。" : REQUEST_MESSAGES.overviewFallback);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [query]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(id, status);
      message.success("状态更新成功");
      loadData();
    } catch (err) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      message.success("状态更新成功（本地模式）");
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "订单编号",
      dataIndex: "bookingNo",
      key: "bookingNo",
      width: 160,
      render: (value) => <span style={{ fontFamily: "monospace" }}>{value}</span>,
    },
    {
      title: "入住人",
      key: "customer",
      width: 160,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <span><UserOutlined /> {record.customerName}</span>
          <span style={{ color: "#666", fontSize: 12 }}>{record.customerPhone}</span>
        </Space>
      ),
    },
    {
      title: "营位类型",
      key: "siteType",
      width: 120,
      render: (_, record) => (
        <Tag color="geekblue">{siteTypeLabels[record.siteType]}</Tag>
      ),
    },
    {
      title: "营位",
      dataIndex: "siteName",
      key: "siteName",
      width: 140,
    },
    {
      title: "入住时段",
      key: "period",
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <span><CalendarOutlined /> {record.checkInDate}</span>
          <span style={{ color: "#666", fontSize: 12 }}>
            至 {record.checkOutDate} · {record.nights} 晚 · {record.guestCount} 人
          </span>
        </Space>
      ),
    },
    {
      title: "金额",
      key: "amount",
      width: 100,
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>¥{record.totalAmount}</span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value) => <Tag color={statusColorMap[value]}>{statusLabels[value]}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      render: (_, record) => {
        const nextStatuses = editableStatusMap[record.status];
        if (nextStatuses.length === 0) {
          return <span style={{ color: "#999" }}>不可更改</span>;
        }
        return (
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Option value={record.status} disabled>
              {statusLabels[record.status]}
            </Option>
            {nextStatuses.map((s) => (
              <Option key={s} value={s}>
                → {statusLabels[s]}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      ellipsis: true,
      render: (value) => value || <span style={{ color: "#ccc" }}>-</span>,
    },
  ];

  return (
    <div>
      <section className="lead-grid">
        <article className="hero-panel">
          <span className="pill">{notice}</span>
          <Title level={2}>客户预约管理</Title>
          <p>管理所有客户预约订单，按状态筛选订单，管理员可更新预约状态，追踪入住进度。</p>
        </article>
        <section className="metric-grid" aria-label="预约统计">
          <Card className="metric-card" variant="outlined">
            <Space align="center">
              <CalendarOutlined style={{ fontSize: 24, color: "#b14f3b" }} />
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>总预约</div>
                <strong className="metric-value">{statistics.total}</strong>
              </div>
            </Space>
          </Card>
          <Card className="metric-card" variant="outlined">
            <Space align="center">
              <UserOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>待确认</div>
                <strong className="metric-value">{statistics.pending}</strong>
              </div>
            </Space>
          </Card>
          <Card className="metric-card" variant="outlined">
            <Space align="center">
              <CalendarOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>已确认</div>
                <strong className="metric-value">{statistics.confirmed}</strong>
              </div>
            </Space>
          </Card>
          <Card className="metric-card" variant="outlined">
            <Space align="center">
              <MoneyCollectOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>营收总额</div>
                <strong className="metric-value">¥{statistics.totalAmount}</strong>
              </div>
            </Space>
          </Card>
        </section>
      </section>

      <section className="work-panel">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>预约订单列表</Title>
          </Col>
          <Col>
            <Space>
              <Select
                placeholder="筛选状态"
                style={{ width: 140 }}
                allowClear
                value={query.status || undefined}
                onChange={(value) => setQuery({ ...query, status: value || "" })}
              >
                <Option value="pending">待确认</Option>
                <Option value="confirmed">已确认</Option>
                <Option value="checkin_pending">待入住</Option>
                <Option value="completed">已完成</Option>
              </Select>
              <Select
                placeholder="筛选类型"
                style={{ width: 140 }}
                allowClear
                value={query.siteType || undefined}
                onChange={(value) => setQuery({ ...query, siteType: value || "" })}
              >
                <Option value="tent">帐篷区</Option>
                <Option value="rv">房车区</Option>
                <Option value="cabin">木屋区</Option>
              </Select>
              <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
                刷新
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1100 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </section>
    </div>
  );
}
