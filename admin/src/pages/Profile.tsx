import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Avatar } from 'antd';
import { UserOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const onUpdateProfile = async (values: { username: string }) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', values);
      message.success('用户名更新成功');
      const updatedUser = { ...user, username: res.data.user.username };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      message.error(err.response?.data?.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', values);
      message.success('密码修改成功，请重新登录');
      pwdForm.resetFields();
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    } catch (err: any) {
      message.error(err.response?.data?.message || '密码修改失败');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>个人信息</Title>

      <div style={{ maxWidth: 600 }}>
        <Card
          title="基本资料"
          style={{ marginBottom: 24, borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar size={64} style={{ background: 'linear-gradient(135deg, #1a2035, #2d3a5e)' }} icon={<UserOutlined />} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user.username || '管理员'}</div>
              <div style={{ color: '#888', fontSize: 13 }}>{user.email}</div>
              <div style={{ color: '#888', fontSize: 13 }}>角色: {user.role === 'admin' ? '管理员' : '编辑'}</div>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ username: user.username || '' }}
            onFinish={onUpdateProfile}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存用户名
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="修改密码"
          style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Form form={pwdForm} layout="vertical" onFinish={onChangePassword}>
            <Form.Item
              label="原密码"
              name="oldPassword"
              rules={[{ required: true, message: '请输入原密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="原密码" />
            </Form.Item>
            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[{ required: true, message: '请输入新密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
            </Form.Item>
            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={pwdLoading} danger icon={<LockOutlined />}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
