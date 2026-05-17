import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username?: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const res = await api.post(endpoint, values);
      if (isRegister) {
        message.success(res.data.message || '注册申请已提交');
        setIsRegister(false);
      } else {
        const { token, user } = res.data;
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        message.success(`欢迎回来，${user.username}！`);
        navigate('/');
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || (isRegister ? '注册失败' : '登录失败，请检查账号密码'));
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
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #1a2035, #2d3a5e)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(26,32,53,0.4)',
          }}>
            <CarOutlined style={{ color: '#c9a84c', fontSize: 28 }} />
          </div>
          <Title level={3} style={{ marginBottom: 4, color: '#1a2035' }}>汽车商城</Title>
          <Text type="secondary">后台管理系统</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          {isRegister && (
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bbb' }} />}
                placeholder="用户名"
                size="large"
                style={{ borderRadius: 10, height: 48 }}
              />
            </Form.Item>
          )}

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
            {isRegister ? '提交注册申请' : '登录管理后台'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text
            type="secondary"
            style={{ cursor: 'pointer', fontSize: 13 }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
          </Text>
        </div>

        {isRegister && (
          <div style={{ marginTop: 16, fontSize: 12, color: '#999', textAlign: 'center' }}>
            注册后需等待管理员审批才能登录
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
