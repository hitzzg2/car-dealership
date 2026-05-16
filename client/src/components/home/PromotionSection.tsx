import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Spin } from 'antd';
import { GiftOutlined, ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getPromotions } from '../../api/publicApi';

const PromotionSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language as 'zh' | 'en';

  useEffect(() => {
    getPromotions()
      .then(res => setPromotions((res.data.data || []).filter((p: any) => p.type !== 'banner')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (promotions.length === 0 && !loading) return null;

  return (
    <section style={{
      padding: '60px 24px',
      background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <GiftOutlined style={{ color: '#c9a84c', fontSize: 20 }} />
              <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: 14 }}>SALE</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'white', margin: 0 }}>
              {t('home.promotions')}
            </h2>
            <div style={{ width: 50, height: 3, background: '#c9a84c', marginTop: 8 }} />
          </div>
          <Button
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/cars')}
            style={{
              border: '2px solid rgba(255,255,255,0.4)',
              color: 'white',
              borderRadius: 24,
              height: 40,
              fontWeight: 600,
            }}
          >
            {t('home.viewAll')}
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {promotions.slice(0, 3).map((promo) => (
              <Col xs={24} md={8} key={promo._id}>
                <div
                  onClick={() => navigate(promo.link || '/cars')}
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    height: 240,
                    transition: 'transform 0.3s ease',
                  }}
                  className="car-card"
                >
                  <img
                    src={promo.image}
                    alt={promo.title?.[lang]}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px 20px',
                  }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                      color: '#1a2035',
                      padding: '2px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}>
                      {promo.type === 'special' ? '限时特惠' : '优惠活动'}
                    </div>
                    <h3 style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 700,
                      margin: '0 0 4px',
                    }}>
                      {promo.title?.[lang] || promo.title?.zh}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>
                      {promo.description?.[lang] || promo.description?.zh}
                    </p>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: 'white',
                    fontSize: 12,
                    background: 'rgba(0,0,0,0.4)',
                    padding: '4px 10px',
                    borderRadius: 20,
                    backdropFilter: 'blur(4px)',
                  }}>
                    <ClockCircleOutlined />
                    <span>
                      {new Date(promo.endDate).toLocaleDateString('zh-CN')} 截止
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
};

export default PromotionSection;
