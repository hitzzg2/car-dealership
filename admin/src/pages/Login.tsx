import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      const { token, user } = res.data;
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      message.success(`欢迎回来，${user.username}！`);
      navigate('/');
    } catch (err: any) {
      message.error(err.response?.data?.message || '登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 60%, #1a2035 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'fixed', top: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(201,168,76,0.08)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -150, left: -100,
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(201,168,76,0.05)',
        pointerEvents: 'none',
      }} />

      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 20,
          border: 'none',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #1a2035, #2d3a5e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(26,32,53,0.4)',
          }}>
            <CarOutlined style={{ color: '#c9a84c', fontSize: 28 }} />
          </div>
          <Title level={3} style={{ marginBottom: 4, color: '#1a2035' }}>汽车商城</Title>
          <Text type="secondary">后台管理系统</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入管理员邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bbb' }} />}
              placeholder="管理员邮箱"
              size="large"
              style={{ borderRadius: 10, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bbb' }} />}
              placeholder="登录密码"
              size="large"
              style={{ borderRadius: 10, height: 48 }}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={loading}
            size="large"
            block
            style={{
              background: 'linear-gradient(135deg, #1a2035, #2d3a5e)',
              border: 'none',
              color: 'white',
              height: 50,
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            登录管理后台
          </Button>
        </Form>

        <Divider style={{ margin: '28px 0 20px' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>默认账号</Text>
        </Divider>
        <div style={{
          background: '#f8f9fa',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 13,
          color: '#666',
          lineHeight: 1.8,
        }}>
          <div>📧 邮箱: admin@cardealership.com</div>
          <div>🔑 密码: Admin@123456</div>
          <div style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>⚠️ 首次登录后请修改密码</div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
