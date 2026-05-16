import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Tag, Button } from 'antd';
import { EyeOutlined, CarOutlined } from '@ant-design/icons';

interface CarCardProps {
  car: any;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language as 'zh' | 'en';

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `¥${(price / 10000).toFixed(1)}万`;
    }
    return `¥${price.toLocaleString()}`;
  };

  const mainImage = car.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80';

  return (
    <Card
      hoverable
      className="car-card"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
      cover={
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img
            src={mainImage}
            alt={car.name?.[lang] || car.name?.zh}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.06)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
          />
          {/* Type badge */}
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className={car.type === 'new' ? 'badge-new' : 'badge-used'}>
              {car.type === 'new' ? t('car.new') : t('car.used')}
            </span>
          </div>
          {/* Discount badge */}
          {car.originalPrice && car.originalPrice > car.price && (
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: '#e53e3e',
              color: 'white',
              borderRadius: 12,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
            }}>
              -{Math.round((1 - car.price / car.originalPrice) * 100)}%
            </div>
          )}
        </div>
      }
    >
      <div style={{ padding: '16px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Brand & Model */}
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
          {car.brand} · {car.year}
          {car.mileage && ` · ${(car.mileage / 10000).toFixed(1)}万公里`}
        </div>
        {/* Name */}
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#1a2035',
          margin: '0 0 8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {car.name?.[lang] || car.name?.zh}
        </h3>

        {/* Features */}
        {car.features && car.features.length > 0 && (
          <div style={{ marginBottom: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {car.features.slice(0, 3).map((f: string, i: number) => (
              <Tag key={i} style={{ fontSize: 11, borderRadius: 10, background: '#f5f5f5', border: 'none', color: '#666' }}>
                {f}
              </Tag>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span className="price-tag">{formatPrice(car.price)}</span>
            {car.originalPrice && car.originalPrice > car.price && (
              <span style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through' }}>
                {formatPrice(car.originalPrice)}
              </span>
            )}
          </div>

          {/* Action */}
          <Button
            block
            icon={<EyeOutlined />}
            onClick={() => navigate(`/cars/${car._id}`)}
            style={{
              background: 'linear-gradient(135deg, #1a2035, #2d3a5e)',
              border: 'none',
              color: 'white',
              borderRadius: 8,
              height: 38,
              fontWeight: 600,
            }}
          >
            {t('home.viewDetails')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CarCard;
