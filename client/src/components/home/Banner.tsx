import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Button, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { getBanners } from '../../api/publicApi';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Banner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBanners()
      .then(res => setBanners(res.data.data || []))
      .catch(() => {
        // Fallback banners
        setBanners([
          {
            _id: '1',
            title: { zh: '全新车系盛大上市', en: 'New Models Grand Launch' },
            description: { zh: '2024全新车系重磅登场，感受极致驾乘体验', en: 'Experience the ultimate driving pleasure with our 2024 lineup' },
            image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=80',
            link: '/cars?type=new',
          },
          {
            _id: '2',
            title: { zh: '二手好车特惠专场', en: 'Used Cars Special Deals' },
            description: { zh: '精选认证二手车，品质保障，价格实惠', en: 'Certified pre-owned vehicles with quality guarantee' },
            image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80',
            link: '/cars?type=used',
          },
          {
            _id: '3',
            title: { zh: '新能源购车补贴', en: 'EV Purchase Subsidy' },
            description: { zh: '国家新能源补贴政策，购车享最高5万元优惠', en: 'Government EV subsidies up to ¥50,000 off' },
            image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=80',
            link: '/cars?category=ev',
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const lang = i18n.language as 'zh' | 'en';

  if (loading) {
    return (
      <div style={{
        height: 560,
        background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper"
        style={{ height: 560 }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div
              style={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Background image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(1.05)',
                  transition: 'transform 5s ease',
                }}
              />
              {/* Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(26,32,53,0.85) 0%, rgba(26,32,53,0.4) 60%, rgba(26,32,53,0.1) 100%)',
              }} />
              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 1280,
                margin: '0 auto',
                padding: '0 24px',
              }}>
                <div style={{ maxWidth: 600 }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                    color: '#1a2035',
                    padding: '4px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 20,
                    letterSpacing: 1,
                  }}>
                    {lang === 'zh' ? '优质汽车服务商' : 'Premium Auto Dealer'}
                  </div>
                  <h1 style={{
                    fontSize: 'clamp(28px, 4vw, 52px)',
                    fontWeight: 800,
                    color: 'white',
                    lineHeight: 1.2,
                    marginBottom: 16,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {banner.title?.[lang] || banner.title?.zh}
                  </h1>
                  <p style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.85)',
                    marginBottom: 32,
                    lineHeight: 1.7,
                  }}>
                    {banner.description?.[lang] || banner.description?.zh}
                  </p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <Button
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                        border: 'none',
                        color: '#1a2035',
                        fontWeight: 700,
                        height: 48,
                        padding: '0 32px',
                        borderRadius: 24,
                        fontSize: 15,
                      }}
                      onClick={() => navigate(banner.link || '/cars')}
                      icon={<ArrowRightOutlined />}
                    >
                      {t('home.viewDetails')}
                    </Button>
                    <Button
                      size="large"
                      style={{
                        background: 'transparent',
                        border: '2px solid rgba(255,255,255,0.5)',
                        color: 'white',
                        height: 48,
                        padding: '0 32px',
                        borderRadius: 24,
                        fontSize: 15,
                      }}
                      onClick={() => navigate('/contact')}
                    >
                      {t('nav.contact')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
