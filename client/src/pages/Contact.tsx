import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card } from 'antd';
import {
  WhatsAppOutlined,
  WechatOutlined,
  SendOutlined,
  MailOutlined,
  FacebookOutlined,
  MessageOutlined,
  InstagramOutlined,
  CarOutlined,
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';

interface ContactMethod {
  icon: React.ReactNode;
  label: { zh: string; en: string };
  value: string;
  href: string;
}

const contactMethods: ContactMethod[] = [
  {
    icon: <WhatsAppOutlined style={{ color: '#25D366', fontSize: 28 }} />,
    label: { zh: 'WhatsApp', en: 'WhatsApp' },
    value: '+86 159 1816 1885',
    href: 'https://wa.me/8615918161885',
  },
  {
    icon: <WechatOutlined style={{ color: '#07C160', fontSize: 28 }} />,
    label: { zh: '微信', en: 'WeChat' },
    value: 'chinavehice77',
    href: 'weixin://dl/chat?chinavehice77',
  },
  {
    icon: <SendOutlined style={{ color: '#0088cc', fontSize: 28 }} />,
    label: { zh: 'Telegram', en: 'Telegram' },
    value: '+86 159 1816 1885',
    href: 'https://t.me/+8615918161885',
  },
  {
    icon: <MailOutlined style={{ color: '#EA4335', fontSize: 28 }} />,
    label: { zh: '邮箱', en: 'Email' },
    value: 'chinavehice77@gmail.com',
    href: 'mailto:chinavehice77@gmail.com',
  },
  {
    icon: <FacebookOutlined style={{ color: '#1877F2', fontSize: 28 }} />,
    label: { zh: 'Facebook', en: 'Facebook' },
    value: 'China Vehicle Auto',
    href: 'https://facebook.com/ChinaVehicleAuto',
  },
  {
    icon: <MessageOutlined style={{ color: '#000000', fontSize: 28 }} />,
    label: { zh: 'TikTok', en: 'TikTok' },
    value: '@ChinaCar_Export',
    href: 'https://tiktok.com/@ChinaCar_Export',
  },
  {
    icon: <InstagramOutlined style={{ color: '#E4405F', fontSize: 28 }} />,
    label: { zh: 'Instagram', en: 'Instagram' },
    value: '@china_vehice77',
    href: 'https://instagram.com/china_vehice77',
  },
];

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'zh' | 'en';

  return (
    <MainLayout>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
          padding: '60px 24px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
          {t('contact.title')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16 }}>
          {t('contact.subtitle')}
        </p>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <Row gutter={[24, 24]}>
          {contactMethods.map((method, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <a
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                  }}
                  bodyStyle={{ padding: '28px 16px' }}
                >
                  <div style={{ marginBottom: 14 }}>{method.icon}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                    {method.label[lang]}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#1a2035',
                      fontSize: 14,
                      wordBreak: 'break-all',
                    }}
                  >
                    {method.value}
                  </div>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </div>
    </MainLayout>
  );
};

export default Contact;
