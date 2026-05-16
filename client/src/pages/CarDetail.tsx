import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Row, Col, Tag, Button, Spin, Descriptions, Divider, Image, Typography
} from 'antd';
import {
  PhoneOutlined, ArrowLeftOutlined, EnvironmentOutlined,
  CalendarOutlined, DashboardOutlined, TagOutlined,
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import CarCard from '../components/car/CarCard';
import { getCarById } from '../api/publicApi';

const { Title, Paragraph } = Typography;

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  const lang = i18n.language as 'zh' | 'en';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCarById(id)
      .then(res => {
        setCar(res.data.data);
        setRelated(res.data.related || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: 120 }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!car) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: 80 }}>
          <p>车辆不存在</p>
          <Button onClick={() => navigate('/cars')}>返回列表</Button>
        </div>
      </MainLayout>
    );
  }

  const images = car.images?.length > 0
    ? car.images
    : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'];

  const formatPrice = (p: number) => p >= 10000 ? `¥${(p / 10000).toFixed(1)}万` : `¥${p.toLocaleString()}`;

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div style={{ background: '#f8f9fa', padding: '12px 24px', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            onClick={() => navigate(-1)}
            style={{ color: '#666', paddingLeft: 0 }}
          >
            返回列表
          </Button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <Row gutter={[40, 32]}>
          {/* Images */}
          <Col xs={24} lg={14}>
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
              <Image
                src={images[activeImg]}
                alt={car.name?.[lang]}
                style={{ width: '100%', height: 440, objectFit: 'cover' }}
                preview={{ src: images[activeImg] }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
                {images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    onClick={() => setActiveImg(idx)}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: idx === activeImg ? '2px solid #c9a84c' : '2px solid transparent',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )}
            {/* Video */}
            {car.videos && car.videos.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <video
                  controls
                  style={{ width: '100%', borderRadius: 12 }}
                  src={car.videos[0]}
                />
              </div>
            )}
          </Col>

          {/* Info */}
          <Col xs={24} lg={10}>
            {/* Type badges */}
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className={car.type === 'new' ? 'badge-new' : 'badge-used'}>
                {car.type === 'new' ? t('car.new') : t('car.used')}
              </span>
              {car.category && (
                <Tag style={{ borderRadius: 20, fontSize: 12 }}>
                  {car.category.name?.[lang] || car.category.name?.zh}
                </Tag>
              )}
            </div>

            <Title level={2} style={{ color: '#1a2035', marginBottom: 8, fontSize: 28 }}>
              {car.name?.[lang] || car.name?.zh}
            </Title>

            <div style={{ display: 'flex', gap: 20, marginBottom: 20, color: '#666', fontSize: 14 }}>
              <span><CalendarOutlined style={{ marginRight: 4 }} />{car.year}</span>
              {car.mileage && (
                <span><DashboardOutlined style={{ marginRight: 4 }} />{(car.mileage / 10000).toFixed(1)}万公里</span>
              )}
              {car.condition && <span>{car.condition}</span>}
            </div>

            {/* Price */}
            <div style={{
              background: 'linear-gradient(135deg, #fff5f5, #fff)',
              border: '1px solid #fed7d7',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 24,
            }}>
              <span className="price-tag" style={{ fontSize: 36 }}>{formatPrice(car.price)}</span>
              {car.originalPrice && car.originalPrice > car.price && (
                <>
                  <span style={{ fontSize: 16, color: '#aaa', textDecoration: 'line-through', marginLeft: 12 }}>
                    {formatPrice(car.originalPrice)}
                  </span>
                  <Tag color="red" style={{ marginLeft: 8, borderRadius: 12 }}>
                    省{formatPrice(car.originalPrice - car.price)}
                  </Tag>
                </>
              )}
            </div>

            {/* Key specs */}
            {car.specifications && (
              <Descriptions
                column={2}
                size="small"
                style={{ marginBottom: 20 }}
                bordered
              >
                {car.specifications.engine && (
                  <Descriptions.Item label={t('car.engine')}>{car.specifications.engine}</Descriptions.Item>
                )}
                {car.specifications.transmission && (
                  <Descriptions.Item label={t('car.transmission')}>{car.specifications.transmission}</Descriptions.Item>
                )}
                {car.specifications.fuel && (
                  <Descriptions.Item label={t('car.fuel')}>{car.specifications.fuel}</Descriptions.Item>
                )}
                {car.specifications.color && (
                  <Descriptions.Item label={t('car.color')}>{car.specifications.color}</Descriptions.Item>
                )}
                {car.specifications.seats && (
                  <Descriptions.Item label={t('car.seats')}>{car.specifications.seats}座</Descriptions.Item>
                )}
              </Descriptions>
            )}

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#1a2035', marginBottom: 10 }}>{t('car.features')}</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {car.features.map((f: string, i: number) => (
                    <Tag key={i} style={{
                      borderRadius: 16,
                      padding: '4px 12px',
                      background: '#f0f4ff',
                      border: 'none',
                      color: '#1a2035',
                      fontSize: 13,
                    }}>
                      {f}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
              <Button
                size="large"
                icon={<PhoneOutlined />}
                onClick={() => navigate('/contact')}
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                  border: 'none',
                  color: '#1a2035',
                  fontWeight: 700,
                  height: 50,
                  borderRadius: 12,
                  fontSize: 16,
                }}
                block
              >
                {t('car.contactSales')}
              </Button>
              <Button
                size="large"
                href="tel:400-888-8888"
                style={{
                  border: '2px solid #1a2035',
                  color: '#1a2035',
                  height: 50,
                  borderRadius: 12,
                }}
                block
              >
                400-888-8888
              </Button>
            </div>
          </Col>
        </Row>

        {/* Description */}
        {(car.description?.zh || car.description?.en) && (
          <>
            <Divider />
            <div style={{ maxWidth: 800 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a2035', marginBottom: 12 }}>车辆介绍</h3>
              <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555' }}>
                {car.description?.[lang] || car.description?.zh}
              </Paragraph>
            </div>
          </>
        )}

        {/* Related */}
        {related.length > 0 && (
          <>
            <Divider />
            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1a2035', marginBottom: 24 }}>
              {t('car.relatedCars')}
            </h3>
            <Row gutter={[24, 24]}>
              {related.slice(0, 4).map((r: any) => (
                <Col xs={24} sm={12} md={6} key={r._id}>
                  <CarCard car={r} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CarDetail;
