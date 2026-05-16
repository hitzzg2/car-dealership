import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card } from 'antd';
import {
  CarOutlined, SwapOutlined, StarOutlined, ThunderboltOutlined, InboxOutlined,
} from '@ant-design/icons';
import { getCategories } from '../../api/publicApi';

const iconMap: Record<string, React.ReactNode> = {
  car: <CarOutlined style={{ fontSize: 32 }} />,
  swap: <SwapOutlined style={{ fontSize: 32 }} />,
  star: <StarOutlined style={{ fontSize: 32 }} />,
  inbox: <InboxOutlined style={{ fontSize: 32 }} />,
  thunderbolt: <ThunderboltOutlined style={{ fontSize: 32 }} />,
};

const defaultCategories = [
  { _id: '1', name: { zh: '新车', en: 'New Cars' }, icon: 'car', slug: 'new-cars', link: '/cars?type=new' },
  { _id: '2', name: { zh: '二手车', en: 'Used Cars' }, icon: 'swap', slug: 'used-cars', link: '/cars?type=used' },
  { _id: '3', name: { zh: '豪华车', en: 'Luxury' }, icon: 'star', slug: 'luxury', link: '/cars' },
  { _id: '4', name: { zh: 'SUV', en: 'SUV' }, icon: 'inbox', slug: 'suv', link: '/cars' },
  { _id: '5', name: { zh: '新能源', en: 'EV/Hybrid' }, icon: 'thunderbolt', slug: 'ev', link: '/cars' },
];

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

const CategorySection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories(defaultCategories));
  }, []);

  const lang = i18n.language as 'zh' | 'en';
  const items = categories.length > 0 ? categories : defaultCategories;

  const getLink = (cat: any) => {
    if (cat.slug === 'new-cars') return '/cars?type=new';
    if (cat.slug === 'used-cars') return '/cars?type=used';
    return `/cars?category=${cat._id}`;
  };

  return (
    <section style={{ padding: '60px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="section-title" style={{ fontSize: 32, fontWeight: 700, color: '#1a2035', display: 'inline-block' }}>
            {t('home.categories')}
          </h2>
          <div style={{ width: 50, height: 3, background: '#c9a84c', margin: '12px auto 0' }} />
        </div>

        <Row gutter={[20, 20]} justify="center">
          {items.map((cat, idx) => (
            <Col xs={12} sm={8} md={6} lg={4} key={cat._id || idx}>
              <Card
                hoverable
                onClick={() => navigate(getLink(cat))}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                }}
                bodyStyle={{ padding: '28px 16px' }}
                className="car-card"
              >
                <div style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: gradients[idx % gradients.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>
                  {iconMap[cat.icon || 'car']}
                </div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#1a2035',
                  margin: 0,
                }}>
                  {cat.name?.[lang] || cat.name?.zh}
                </h3>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default CategorySection;
