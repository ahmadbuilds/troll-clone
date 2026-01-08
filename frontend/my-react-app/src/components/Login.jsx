import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Form, Input, Button, Typography, Card, Spin, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { login, enterAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);

    const { email, password } = values;

    // Clear form inputs immediately as requested
    form.resetFields();

    try {
      await login(email, password);
      messageApi.destroy();
      messageApi.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      messageApi.destroy();
      messageApi.error("Failed to login: " + err.message);
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    messageApi.success("Entering as guest...");
    enterAsGuest();
    setTimeout(() => navigate("/dashboard"), 500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      {contextHolder}
      <Spin
        spinning={loading}
        // indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      >
        <Card style={{ width: 500, padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3}>Sign in to your account</Title>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email address"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  disabled={
                    !form.isFieldsTouched(true) ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                >
                  Sign in
                </Button>
              )}
            </Form.Item>
          </Form>

          <Button
            icon={<UserOutlined />}
            onClick={handleGuestLogin}
            block
            size="large"
            style={{ marginBottom: 16 }}
          >
            Continue as Guest
          </Button>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </Text>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default Login;
