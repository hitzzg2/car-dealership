import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Spin } from 'antd';
import { ArrowRightOutlined, FireOutlined } from '@ant-design/icons';
import CarCard from '../car/CarCard';
import { getPopularCars } from '../../api/publicApi';

const PopularCars: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularCars()
      .then(res => setCars(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '60px 24px', background: '#f8f9fa' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FireOutlined style={{ color: '#e53e3e', fontSize: 20 }} />
              <span style={{ color: '#e53e3e', fontWeight: 600, fontSize: 14 }}>
                {t('car.new')}
              </span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1a2035', margin: 0 }}>
              {t('home.popularCars')}
            </h2>
            <div style={{ width: 50, height: 3, background: '#c9a84c', marginTop: 8 }} />
          </div>
          <Button
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/cars')}
            style={{
              border: '2px solid #1a2035',
              color: '#1a2035',
              borderRadius: 24,
              padding: '0 24px',
              height: 40,
              fontWeight: 600,
            }}
          >
            {t('home.viewAll')}
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {cars.slice(0, 4).map(car => (
              <Col xs={24} sm={12} md={8} lg={6} key={car._id}>
                <CarCard car={car} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
};

export default PopularCars;
