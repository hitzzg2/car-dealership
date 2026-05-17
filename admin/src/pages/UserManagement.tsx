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
      message.error(err.response?.data?.message || '获取用户列表失败');
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
      message.success('审批通过');
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || '审批失败');
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const res = await api.put(`/auth/users/${id}/toggle-active`);
      message.success(res.data.message);
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || '操作失败');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/auth/users/${id}`);
      message.success('用户已删除');
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || '删除失败');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role === 'admin' ? '管理员' : '编辑'}
        </Tag>
      ),
    },
    {
      title: '审批状态',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (approved: boolean) => (
        approved
          ? <Tag color="success">已通过</Tag>
          : <Tag color="warning">待审批</Tag>
      ),
    },
    {
      title: '账号状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        active
          ? <Tag color="success">启用</Tag>
          : <Tag color="default">禁用</Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date?: string) => date ? new Date(date).toLocaleString('zh-CN') : '—',
    },
    {
      title: '操作',
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
              通过
            </Button>
          )}
          {record.isApproved && (
            <Button
              size="small"
              icon={record.isActive ? <CloseOutlined /> : <CheckOutlined />}
              onClick={() => toggleActive(record._id)}
            >
              {record.isActive ? '禁用' : '启用'}
            </Button>
          )}
          <Popconfirm
            title="确定要删除此用户吗？"
            onConfirm={() => deleteUser(record._id)}
            okText="删除"
            cancelText="取消"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>用户管理</Title>
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
