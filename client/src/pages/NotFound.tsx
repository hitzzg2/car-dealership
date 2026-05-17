import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotFound: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        <Link to="/">
          <Button type="primary" style={{ background: '#1a2035' }}>Back to Home</Button>
        </Link>
      }
    />
  </div>
);

export default NotFound;
