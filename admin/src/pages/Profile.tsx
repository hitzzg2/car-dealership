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
      message.success('Username updated');
      const updatedUser = { ...user, username: res.data.user.username };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', values);
      message.success('Password changed, please login again');
      pwdForm.resetFields();
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Profile</Title>

      <div style={{ maxWidth: 600 }}>
        <Card
          title="Basic Info"
          style={{ marginBottom: 24, borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar size={64} style={{ background: 'linear-gradient(135deg, #1a2035, #2d3a5e)' }} icon={<UserOutlined />} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user.username || 'Admin'}</div>
              <div style={{ color: '#888', fontSize: 13 }}>{user.email}</div>
              <div style={{ color: '#888', fontSize: 13 }}>Role: {user.role === 'admin' ? 'Admin' : 'Editor'}</div>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ username: user.username || '' }}
            onFinish={onUpdateProfile}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter username' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save Username
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="Change Password"
          style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Form form={pwdForm} layout="vertical" onFinish={onChangePassword}>
            <Form.Item
              label="Current Password"
              name="oldPassword"
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: 'Please enter new password' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
            </Form.Item>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={pwdLoading} danger icon={<LockOutlined />}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
