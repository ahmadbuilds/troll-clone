import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Spin,
  message,
  Select,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  TeamOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    setLoading(true);

    const { username, email, password, role } = values;

    // Clear form
    form.resetFields();

    try {
      await signup(email, password, username, role);
      messageApi.destroy();
      messageApi.success("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      messageApi.destroy();
      messageApi.error("Failed to create an account: " + err.message);
      setLoading(false);
    }
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
            <Title level={3}>Create your account</Title>
          </div>

          <Form
            form={form}
            name="signup"
            onFinish={handleSignup}
            layout="vertical"
            size="large"
            initialValues={{ role: "developer" }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 3, message: "Username must be at least 3 characters!" },
              ]}
              validateTrigger="onBlur"
              style={{ marginBottom: 24 }}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              validateTrigger="onBlur"
              style={{ marginBottom: 24 }}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email address"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="role"
              rules={[{ required: true, message: "Please select your role!" }]}
              style={{ marginBottom: 24 }}
            >
              <Select
                placeholder="Select your role"
                // suffixIcon={<TeamOutlined />}
                allowClear
                options={[
                  { value: "developer", label: "Developer" },
                  { value: "QA", label: "QA" },
                  { value: "HR", label: "HR" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              validateTrigger="onBlur"
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="new-password"
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
                  Sign up
                </Button>
              )}
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Already have an account? <Link to="/login">Log in</Link>
            </Text>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default Signup;
