import { ConfigProvider, Layout, Menu, Button, theme } from "antd";
import { ApiOutlined } from "@ant-design/icons";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { APP_CODE, APP_NAME, APP_THEME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { routes } from "./routes";
import { OverviewPage } from "./pages/OverviewPage";
import { BookingPage } from "./pages/BookingPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";

const { Header, Content } = Layout;

function Navigation() {
  const location = useLocation();
  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      style={{ background: "transparent", borderBottom: "none", minWidth: 400 }}
      items={routes.map((r) => ({
        key: r.path,
        label: <Link to={r.path}>{r.label}</Link>,
      }))}
    />
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_THEME.accent,
          colorText: APP_THEME.ink,
          colorBgBase: APP_THEME.paper,
          borderRadius: 8,
        },
      }}
    >
      <Layout className="app-shell">
        <Header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <Navigation />
          <Button type="primary" icon={<ApiOutlined />} href={REQUEST_MESSAGES.healthPath}>
            API Health
          </Button>
        </Header>
        <Content className="workspace">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/bookings" element={<BookingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
