import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Typography } from 'antd';
import {
  CarOutlined, PhoneOutlined, MailOutlined,
  EnvironmentOutlined, WechatOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer style={{ background: '#1a2035', color: 'rgba(255,255,255,0.75)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 24px' }}>
        <Row gutter={[48, 32]}>
          {/* Brand */}
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CarOutlined style={{ color: '#1a2035', fontSize: 20 }} />
              </div>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>
                {i18n.language === 'zh' ? '汽车商城' : 'AutoMart'}
              </span>
            </div>
            <p style={{ lineHeight: 1.8, fontSize: 14 }}>{t('footer.aboutText')}</p>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={5}>
            <h4 style={{ color: '#c9a84c', marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              {t('footer.quickLinks')}
            </h4>
            {[
              { label: t('nav.home'), path: '/' },
              { label: t('nav.newCars'), path: '/cars?type=new' },
              { label: t('nav.usedCars'), path: '/cars?type=used' },
              { label: t('nav.contact'), path: '/contact' },
            ].map(link => (
              <div key={link.path} style={{ marginBottom: 8 }}>
                <Link
                  to={link.path}
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#c9a84c'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                >
                  › {link.label}
                </Link>
              </div>
            ))}
          </Col>

          {/* Contact */}
          <Col xs={24} sm={12} md={11}>
            <h4 style={{ color: '#c9a84c', marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              {t('footer.contactInfo')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <PhoneOutlined />, text: '400-888-8888' },
                { icon: <MailOutlined />, text: 'sales@cardealership.com' },
                { icon: <EnvironmentOutlined />, text: i18n.language === 'zh' ? '北京市朝阳区建国路88号' : '88 Jianguo Road, Chaoyang, Beijing' },
                { icon: <WechatOutlined />, text: 'cardealer2024' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <span style={{ color: '#c9a84c', width: 16 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: 32,
          paddingTop: 24,
          textAlign: 'center',
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
        }}>
          © {new Date().getFullYear()} {i18n.language === 'zh' ? '汽车商城' : 'AutoMart'} · {t('footer.allRightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
