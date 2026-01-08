import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Layout,
  Card,
  Button,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Avatar,
  Divider,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const { user, isGuest, logout } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            Dashboard
          </Title>
        </Space>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          Logout
        </Button>
      </Header>

      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Welcome Card */}
          <Card
            style={{ marginBottom: 24 }}
            styles={{
              body: { padding: 24 },
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space size="large">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
                <div>
                  <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                    Welcome back,{" "}
                    {isGuest
                      ? "Guest"
                      : user?.user_metadata?.username || user?.email}
                    !
                  </Title>
                  <Space>
                    {isGuest ? (
                      <Tag color="orange" icon={<UserOutlined />}>
                        Guest Mode
                      </Tag>
                    ) : (
                      <>
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Authenticated
                        </Tag>
                        {user?.user_metadata?.role && (
                          <Tag color="blue" icon={<TeamOutlined />}>
                            {user.user_metadata.role}
                          </Tag>
                        )}
                      </>
                    )}
                  </Space>
                </div>
              </Space>

              {isGuest && (
                <>
                  <Divider style={{ margin: "12px 0" }} />
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    <Text type="warning">⚠️</Text> You are viewing this as a
                    guest. Changes will not be saved to the database.
                  </Paragraph>
                </>
              )}
            </Space>
          </Card>

          {/* Feature Cards */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Card
                title="Feature 1"
                bordered={false}
                styles={{
                  body: { minHeight: 120 },
                }}
              >
                <Paragraph type="secondary">
                  This feature is accessible to everyone.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Card
                title="Feature 2"
                bordered={false}
                styles={{
                  body: { minHeight: 120 },
                }}
              >
                <Paragraph type="secondary">
                  This feature is accessible to everyone.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
