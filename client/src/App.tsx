import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import './i18n';
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={i18n.language === 'zh' ? zhCN : enUS}
      theme={{
        token: {
          colorPrimary: '#1a2035',
          borderRadius: 8,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Button: {
            primaryColor: '#fff',
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
