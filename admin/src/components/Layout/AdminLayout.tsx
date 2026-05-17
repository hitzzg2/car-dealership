import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd';
import {
  DashboardOutlined, TagOutlined,
  GiftOutlined, PhoneOutlined, LogoutOutlined,
  UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  TeamOutlined, SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/cars', icon: <CarOutlined />, label: '车辆管理' },
    { key: '/categories', icon: <TagOutlined />, label: '分类管理' },
    { key: '/promotions', icon: <GiftOutlined />, label: '促销管理' },
    { key: '/contacts', icon: <PhoneOutlined />, label: '联系信息' },
    ...(user.role === 'admin' ? [{ key: '/users', icon: <TeamOutlined />, label: '用户管理' }] : []),
    { key: '/profile', icon: <SettingOutlined />, label: '个人信息' },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        width={240}
        collapsedWidth={64}
        collapsed={collapsed}
        style={{
          background: '#1a2035',
          boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          gap: 10,
        }}>
          <img
            src="/favicon.png"
            alt="AutoSKS"
            style={{
              width: 36,
              height: 36,
              objectFit: 'contain',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          {!collapsed && (
            <span style={{ color: 'white', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
              AutoSKS Admin
            </span>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 8,
          }}
          theme="dark"
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{
          background: 'white',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 64,
        }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: 'pointer', fontSize: 18, color: '#1a2035' }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="https://www.autosks.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: '#666' }}
            >
              View Website →
            </a>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar
                  style={{ background: 'linear-gradient(135deg, #1a2035, #2d3a5e)' }}
                  icon={<UserOutlined />}
                />
                <Text style={{ fontSize: 14 }}>{user.username || '管理员'}</Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{
          margin: 24,
          padding: 24,
          background: '#f5f6fa',
          borderRadius: 16,
          minHeight: 'calc(100vh - 112px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
