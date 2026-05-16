import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Row, Col, Card, Select, Input, Slider, Button, Pagination, Spin, Empty, Tag, Drawer
} from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import CarCard from '../components/car/CarCard';
import { getCars, getCategories } from '../api/publicApi';

const { Option } = Select;

const BRANDS = ['BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Honda', 'Volkswagen', 'Tesla', 'BYD', 'Volvo', 'Porsche', 'Lexus', 'Ford'];
const MODELS = ['SUV', 'Sedan', 'Coupe', 'Hatchback', 'Pickup', 'MPV', 'Wagon', 'Convertible'];

const CarList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const lang = i18n.language as 'zh' | 'en';

  // Filter state
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    brand: '',
    model: '',
    keyword: '',
    sort: '-createdAt',
    page: 1,
    priceRange: [0, 2000000] as [number, number],
  });

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const fetchCars = useCallback(() => {
    setLoading(true);
    const params: any = {
      page: filters.page,
      limit: 12,
      sort: filters.sort,
    };
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.model) params.model = filters.model;
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
    if (filters.priceRange[1] < 2000000) params.maxPrice = filters.priceRange[1];

    getCars(params)
      .then(res => {
        setCars(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const title = filters.type === 'new'
    ? t('nav.newCars')
    : filters.type === 'used'
    ? t('nav.usedCars')
    : t('nav.allCars');

  const FilterPanel = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#1a2035' }}>
          {t('car.brand')}
        </label>
        <Select
          placeholder={t('car.brand')}
          allowClear
          style={{ width: '100%' }}
          value={filters.brand || undefined}
          onChange={v => setFilters(f => ({ ...f, brand: v || '', page: 1 }))}
        >
          {BRANDS.map(b => <Option key={b} value={b}>{b}</Option>)}
        </Select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#1a2035' }}>
          {t('car.model')}
        </label>
        <Select
          placeholder={t('car.model')}
          allowClear
          style={{ width: '100%' }}
          value={filters.model || undefined}
          onChange={v => setFilters(f => ({ ...f, model: v || '', page: 1 }))}
        >
          {MODELS.map(m => <Option key={m} value={m}>{m}</Option>)}
        </Select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#1a2035' }}>
          类型
        </label>
        <Select
          placeholder="类型"
          allowClear
          style={{ width: '100%' }}
          value={filters.type || undefined}
          onChange={v => setFilters(f => ({ ...f, type: v || '', page: 1 }))}
        >
          <Option value="new">{t('car.new')}</Option>
          <Option value="used">{t('car.used')}</Option>
        </Select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#1a2035' }}>
          价格范围
        </label>
        <Slider
          range
          min={0}
          max={2000000}
          step={10000}
          value={filters.priceRange}
          onChange={v => setFilters(f => ({ ...f, priceRange: v as [number, number], page: 1 }))}
          tooltip={{ formatter: v => `¥${((v || 0) / 10000).toFixed(0)}万` }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
          <span>¥{(filters.priceRange[0] / 10000).toFixed(0)}万</span>
          <span>¥{(filters.priceRange[1] / 10000).toFixed(0)}万</span>
        </div>
      </div>

      <Button
        block
        onClick={() => setFilters(f => ({ ...f, brand: '', model: '', type: '', priceRange: [0, 2000000], page: 1 }))}
        style={{ borderRadius: 8 }}
      >
        重置筛选
      </Button>
    </div>
  );

  return (
    <MainLayout>
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2035 0%, #2d3a5e 100%)',
        padding: '40px 24px',
        color: 'white',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>{title}</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={t('car.searchPlaceholder')}
              value={filters.keyword}
              onChange={e => setFilters(f => ({ ...f, keyword: e.target.value, page: 1 }))}
              style={{ maxWidth: 360, borderRadius: 24, height: 42 }}
              allowClear
            />
            <Select
              value={filters.sort}
              onChange={v => setFilters(f => ({ ...f, sort: v, page: 1 }))}
              style={{ width: 160, borderRadius: 8 }}
            >
              <Option value="-createdAt">{t('car.sortNewest')}</Option>
              <Option value="price">{t('car.sortPriceAsc')}</Option>
              <Option value="-price">{t('car.sortPriceDesc')}</Option>
            </Select>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterOpen(true)}
              style={{ borderRadius: 24, height: 42, borderColor: 'rgba(255,255,255,0.4)', color: 'white', background: 'transparent' }}
            >
              {t('car.filter')}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 16, color: '#888', fontSize: 14 }}>
          共找到 <strong style={{ color: '#1a2035' }}>{total}</strong> 辆车
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
        ) : cars.length === 0 ? (
          <Empty description={t('car.noResults')} style={{ padding: 80 }} />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {cars.map(car => (
                <Col xs={24} sm={12} md={8} lg={6} key={car._id}>
                  <CarCard car={car} />
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Pagination
                current={filters.page}
                total={total}
                pageSize={12}
                onChange={p => setFilters(f => ({ ...f, page: p }))}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>

      {/* Filter Drawer */}
      <Drawer
        title={t('car.filter')}
        placement="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        width={320}
      >
        <FilterPanel />
      </Drawer>
    </MainLayout>
  );
};

export default CarList;
