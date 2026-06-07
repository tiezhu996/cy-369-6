import { Typography, Result } from "antd";

const { Title } = Typography;

export function ResourcesPage() {
  return (
    <div>
      <section className="lead-grid">
        <article className="hero-panel">
          <span className="pill">功能规划中</span>
          <Title level={2}>资源管理</Title>
          <p>管理营地各项资源，包括营位维护、装备库存、设施巡检等功能模块。</p>
        </article>
      </section>
      <section className="work-panel">
        <Result
          status="info"
          title="资源管理模块"
          subTitle="该模块正在规划建设中，敬请期待。"
        />
      </section>
    </div>
  );
}
