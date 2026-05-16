import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotFound: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Link to="/">
          <Button type="primary" style={{ background: '#1a2035' }}>返回首页</Button>
        </Link>
      }
    />
  </div>
);

export default NotFound;
