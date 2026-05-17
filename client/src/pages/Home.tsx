import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Banner from '../components/home/Banner';
import CategorySection from '../components/home/CategorySection';
import PopularCars from '../components/home/PopularCars';
import PromotionSection from '../components/home/PromotionSection';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Row, Col } from 'antd';
import {
  WhatsAppOutlined, MailOutlined, WechatOutlined, SendOutlined,
  SafetyOutlined, TrophyOutlined, TeamOutlined, CarOutlined,
} from '@ant-design/icons';

const StatsSection: React.FC = () => {
  const { i18n } = useTranslation();
  const stats = [
    { icon: <CarOutlined style={{ fontSize: 32, color: '#c9a84c' }} />, num: '500+', label: i18n.language === 'zh' ? '在售车辆' : 'Cars Available' },
    { icon: <TrophyOutlined style={{ fontSize: 32, color: '#c9a84c' }} />, num: '10年+', label: i18n.language === 'zh' ? '行业经验' : 'Years Experience' },
    { icon: <TeamOutlined style={{ fontSize: 32, color: '#c9a84c' }} />, num: '5000+', label: i18n.language === 'zh' ? '满意客户' : 'Happy Customers' },
    { icon: <SafetyOutlined style={{ fontSize: 32, color: '#c9a84c' }} />, num: '100%', label: i18n.language === 'zh' ? '品质保障' : 'Quality Assured' },
  ];
  return (
    <section style={{ padding: '48px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {stats.map((s, i) => (
            <Col xs={12} md={6} key={i} style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#1a2035', lineHeight: 1 }}>{s.num}</div>
              <div style={{ color: '#666', fontSize: 14, marginTop: 6 }}>{s.label}</div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

const QuickContact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <section style={{ padding: '60px 24px', background: '#f8f9fa' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1a2035' }}>{t('home.contactUs')}</h2>
          <div style={{ width: 50, height: 3, background: '#c9a84c', margin: '12px auto 0' }} />
        </div>
        <Row gutter={[20, 20]} justify="center">
          {[
            { icon: <WhatsAppOutlined style={{ fontSize: 28, color: '#25D366' }} />, text: '+86 159 1816 1885', label: 'WhatsApp' },
            { icon: <WechatOutlined style={{ fontSize: 28, color: '#07C160' }} />, text: 'chinavehice77', label: i18n.language === 'zh' ? '微信' : 'WeChat' },
            { icon: <SendOutlined style={{ fontSize: 28, color: '#0088cc' }} />, text: '+86 159 1816 1885', label: 'Telegram' },
            { icon: <MailOutlined style={{ fontSize: 28, color: '#EA4335' }} />, text: 'chinavehice77@gmail.com', label: i18n.language === 'zh' ? '邮箱' : 'Email' },
          ].map((item, i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '28px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s',
              }}
              className="car-card">
                <div style={{ marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontWeight: 600, color: '#1a2035' }}>{item.text}</div>
              </div>
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Button
            size="large"
            onClick={() => navigate('/contact')}
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
              border: 'none',
              color: '#1a2035',
              fontWeight: 700,
              height: 50,
              padding: '0 48px',
              borderRadius: 25,
              fontSize: 16,
            }}
          >
            {t('contact.submit')}
          </Button>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <MainLayout>
      <Banner />
      <CategorySection />
      <PopularCars />
      <StatsSection />
      <PromotionSection />
      <QuickContact />
    </MainLayout>
  );
};

export default Home;
