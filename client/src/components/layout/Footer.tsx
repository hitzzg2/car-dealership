import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import {
  CarOutlined, MailOutlined,
  WhatsAppOutlined, WechatOutlined, SendOutlined,
} from '@ant-design/icons';

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
                {i18n.language === 'zh' ? '汽车商城' : 'AutoSKS'}
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
                { icon: <WhatsAppOutlined style={{ color: '#25D366' }} />, text: '+86 159 1816 1885' },
                { icon: <WechatOutlined style={{ color: '#07C160' }} />, text: 'chinavehice77' },
                { icon: <SendOutlined style={{ color: '#0088cc' }} />, text: 'Telegram: +86 159 1816 1885' },
                { icon: <MailOutlined style={{ color: '#EA4335' }} />, text: 'chinavehice77@gmail.com' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <span style={{ width: 16 }}>{item.icon}</span>
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
          © {new Date().getFullYear()} HONGKONG SKS TECHNOLOGY CO., LIMITED · {t('footer.allRightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
