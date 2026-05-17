import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Typography, Popconfirm, Space } from 'antd';
import {
  CheckOutlined, CloseOutlined, DeleteOutlined, UserOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  isApproved: boolean;
  lastLogin?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveUser = async (id: string) => {
    try {
      await api.put(`/auth/users/${id}/approve`);
      message.success('User approved');
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const res = await api.put(`/auth/users/${id}/toggle-active`);
      message.success(res.data.message);
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Action failed');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/auth/users/${id}`);
      message.success('User deleted');
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'Editor'}
        </Tag>
      ),
    },
    {
      title: 'Approval',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (approved: boolean) => (
        approved
          ? <Tag color="success">Approved</Tag>
          : <Tag color="warning">Pending</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        active
          ? <Tag color="success">Active</Tag>
          : <Tag color="default">Disabled</Tag>
      ),
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('en-US'),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date?: string) => date ? new Date(date).toLocaleString('en-US') : '—',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="small">
          {!record.isApproved && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => approveUser(record._id)}
            >
              Approve
            </Button>
          )}
          {record.isApproved && (
            <Button
              size="small"
              icon={record.isActive ? <CloseOutlined /> : <CheckOutlined />}
              onClick={() => toggleActive(record._id)}
            >
              {record.isActive ? 'Disable' : 'Enable'}
            </Button>
          )}
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>User Management</Title>
      </div>
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}
      />
    </div>
  );
};

export default UserManagement;
