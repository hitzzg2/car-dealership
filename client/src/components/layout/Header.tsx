import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Drawer, Menu } from 'antd';
import {
  MenuOutlined, GlobalOutlined,
  PhoneOutlined, CloseOutlined,
} from '@ant-design/icons';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLang = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const navLinks = [
    { key: 'home', label: t('nav.home'), path: '/' },
    { key: 'new', label: t('nav.newCars'), path: '/cars?type=new' },
    { key: 'used', label: t('nav.usedCars'), path: '/cars?type=used' },
    { key: 'contact', label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src="/favicon.png"
            alt="AutoSKS"
            style={{
              width: 40,
              height: 40,
              objectFit: 'contain',
              borderRadius: '50%',
            }}
          />
          <span style={{ color: 'white', fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
            AutoSKS
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="hidden md:flex">
          {navLinks.map(link => (
            <Link
              key={link.key}
              to={link.path}
              style={{
                color: 'rgba(255,255,255,0.85)',
                padding: '8px 16px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = '#c9a84c';
                (e.target as HTMLElement).style.background = 'rgba(201,168,76,0.1)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Language switcher */}
          <Button
            onClick={toggleLang}
            icon={<GlobalOutlined />}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: 8,
            }}
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </Button>

          {/* Contact button */}
          <Button
            onClick={() => navigate('/contact')}
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
              border: 'none',
              color: '#1a2035',
              fontWeight: 600,
              borderRadius: 8,
            }}
            icon={<PhoneOutlined />}
            className="hidden md:flex"
          >
            {t('nav.contact')}
          </Button>

          {/* Mobile menu */}
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              display: 'none',
            }}
            className="mobile-menu-btn"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/favicon.png" alt="AutoSKS" style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: '50%' }} />
            <span>AutoSKS</span>
          </div>
        }
        placement="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={280}
      >
        <Menu mode="vertical" style={{ border: 'none' }}>
          {navLinks.map(link => (
            <Menu.Item key={link.key} onClick={() => { navigate(link.path); setMobileOpen(false); }}>
              {link.label}
            </Menu.Item>
          ))}
        </Menu>
        <div style={{ marginTop: 24, padding: '0 16px' }}>
          <Button block onClick={toggleLang} icon={<GlobalOutlined />} style={{ marginBottom: 12 }}>
            {i18n.language === 'zh' ? 'Switch to English' : '切换为中文'}
          </Button>
        </div>
      </Drawer>

      <style>{`
        @media (max-width: 768px) {
          .hidden.md\\:flex { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
