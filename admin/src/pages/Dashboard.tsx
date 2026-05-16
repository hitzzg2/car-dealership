import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Spin } from 'antd';
import {
  CarOutlined, TagOutlined, GiftOutlined, PhoneOutlined,
  RiseOutlined, ArrowUpOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(() => setStats({ total: 0, newCars: 0, usedCars: 0, popular: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const statCards = [
    {
      title: '在售车辆总数',
      value: stats?.total || 0,
      icon: <CarOutlined style={{ fontSize: 32, color: '#6366f1' }} />,
      color: '#6366f1',
      bg: '#eef2ff',
    },
    {
      title: '新车数量',
      value: stats?.newCars || 0,
      icon: <TagOutlined style={{ fontSize: 32, color: '#10b981' }} />,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      title: '二手车数量',
      value: stats?.usedCars || 0,
      icon: <RiseOutlined style={{ fontSize: 32, color: '#f59e0b' }} />,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      title: '热门推荐车辆',
      value: stats?.popular || 0,
      icon: <GiftOutlined style={{ fontSize: 32, color: '#ef4444' }} />,
      color: '#ef4444',
      bg: '#fef2f2',
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 28,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            👋 欢迎回来，{user.username || '管理员'}
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4, display: 'block' }}>
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </div>
        <CarOutlined style={{ fontSize: 48, color: '#c9a84c' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[20, 20]}>
          {statCards.map((s, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card
                style={{
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>{s.title}</Text>
                    <div style={{ fontSize: 36, fontWeight: 800, color: '#1a2035', lineHeight: 1.2, marginTop: 8 }}>
                      {s.value}
                    </div>
                  </div>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: s.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {s.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Quick tips */}
      <Card
        style={{ marginTop: 24, borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        title="📋 快速操作"
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Row gutter={[16, 16]}>
          {[
            { label: '添加新车', path: '/cars/create', color: '#6366f1' },
            { label: '管理分类', path: '/categories', color: '#10b981' },
            { label: '更新促销', path: '/promotions', color: '#f59e0b' },
            { label: '联系信息', path: '/contacts', color: '#ef4444' },
          ].map(item => (
            <Col xs={12} md={6} key={item.path}>
              <a
                href={item.path}
                style={{
                  display: 'block',
                  background: '#f8f9fa',
                  border: `2px solid ${item.color}20`,
                  borderRadius: 12,
                  padding: '16px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: item.color,
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = item.color + '10';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#f8f9fa';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}
              >
                {item.label}
              </a>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;
