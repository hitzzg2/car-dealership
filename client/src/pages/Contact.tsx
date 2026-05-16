import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, Input, Button, message, Card } from 'antd';
import {
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  WechatOutlined, ClockCircleOutlined, UserOutlined,
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { getContacts } from '../api/publicApi';

const { TextArea } = Input;

const iconMap: Record<string, React.ReactNode> = {
  phone: <PhoneOutlined />,
  email: <MailOutlined />,
  address: <EnvironmentOutlined />,
  wechat: <WechatOutlined />,
  social: <ClockCircleOutlined />,
};

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [contacts, setContacts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const lang = i18n.language as 'zh' | 'en';

  useEffect(() => {
    getContacts()
      .then(res => setContacts(res.data.data || []))
      .catch(() => {
        setContacts([
          { _id: '1', type: 'phone', label: { zh: '销售热线', en: 'Sales Hotline' }, value: '400-888-8888', icon: 'phone' },
          { _id: '2', type: 'email', label: { zh: '邮箱', en: 'Email' }, value: 'sales@cardealership.com', icon: 'email' },
          { _id: '3', type: 'address', label: { zh: '门店地址', en: 'Address' }, value: '北京市朝阳区建国路88号', icon: 'address' },
          { _id: '4', type: 'social', label: { zh: '营业时间', en: 'Business Hours' }, value: '周一至周日 9:00-20:00', icon: 'social' },
        ]);
      });
  }, []);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    message.success(t('contact.submitSuccess'));
    form.resetFields();
    setSubmitting(false);
  };

  return (
    <MainLayout>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
        padding: '60px 24px',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ color: 'white', fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
          {t('contact.title')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16 }}>{t('contact.subtitle')}</p>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <Row gutter={[48, 32]}>
          {/* Contact info */}
          <Col xs={24} lg={10}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a2035', marginBottom: 24 }}>
              联系方式
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contacts.map(c => (
                <Card
                  key={c._id}
                  style={{
                    borderRadius: 12,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                  bodyStyle={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a2035, #2d3a5e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c9a84c',
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {iconMap[c.type] || iconMap[c.icon] || <PhoneOutlined />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>
                      {c.label?.[lang] || c.label?.zh}
                    </div>
                    <div style={{ fontWeight: 600, color: '#1a2035', fontSize: 15 }}>{c.value}</div>
                  </div>
                </Card>
              ))}
            </div>
          </Col>

          {/* Form */}
          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: 16,
                border: 'none',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              }}
              bodyStyle={{ padding: '36px' }}
            >
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a2035', marginBottom: 28 }}>
                在线留言
              </h2>
              <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label={t('contact.name')}
                      rules={[{ required: true, message: '请输入姓名' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder={t('contact.name')}
                        style={{ borderRadius: 8, height: 44 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label={t('contact.phone')}
                      rules={[{ required: true, message: '请输入手机号' }]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder={t('contact.phone')}
                        style={{ borderRadius: 8, height: 44 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="email" label="邮箱（选填）">
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="your@email.com"
                    style={{ borderRadius: 8, height: 44 }}
                  />
                </Form.Item>
                <Form.Item
                  name="message"
                  label={t('contact.message')}
                  rules={[{ required: true, message: '请填写留言内容' }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="请描述您感兴趣的车型或您的问题..."
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
                <Button
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  block
                  style={{
                    background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                    border: 'none',
                    color: '#1a2035',
                    fontWeight: 700,
                    height: 50,
                    borderRadius: 12,
                    fontSize: 16,
                  }}
                >
                  {t('contact.submit')}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Contact;
