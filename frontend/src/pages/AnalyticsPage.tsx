import { Typography, Result } from "antd";

const { Title } = Typography;

export function AnalyticsPage() {
  return (
    <div>
      <section className="lead-grid">
        <article className="hero-panel">
          <span className="pill">功能规划中</span>
          <Title level={2}>数据分析</Title>
          <p>多维度运营数据分析，包括入住率趋势、营收分析、客户画像等数据报表。</p>
        </article>
      </section>
      <section className="work-panel">
        <Result
          status="info"
          title="数据分析模块"
          subTitle="该模块正在规划建设中，敬请期待。"
        />
      </section>
    </div>
  );
}
