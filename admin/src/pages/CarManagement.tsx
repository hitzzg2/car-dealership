import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Space, Tag, message, Popconfirm, Switch, Image,
  Modal, Form, Input, Select, InputNumber, Upload, Row, Col, Tabs,
  Divider, Typography
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const BRANDS = ['BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Honda', 'Volkswagen', 'Tesla', 'BYD', 'Volvo', 'Porsche', 'Lexus', 'Cadillac'];

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars/admin/list', { params: { page, limit: 10 } });
      setCars(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch { }
    setLoading(false);
  }, [page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/admin/list');
      setCategories(res.data.data || []);
    } catch { }
  };

  useEffect(() => { fetchCars(); }, [fetchCars]);
  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditingCar(null);
    form.resetFields();
    setUploadedImages([]);
    setUploadedVideos([]);
    setModalOpen(true);
  };

  const openEdit = (car: any) => {
    setEditingCar(car);
    form.setFieldsValue({
      ...car,
      name_zh: car.name?.zh,
      name_en: car.name?.en,
      description_zh: car.description?.zh,
      description_en: car.description?.en,
      category: car.category?._id || car.category,
    });
    setUploadedImages(car.images || []);
    setUploadedVideos(car.videos || []);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/cars/admin/${id}`);
      message.success('Car deleted');
      fetchCars();
    } catch {
      message.error('Delete failed');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/cars/admin/${id}`, { isActive });
      fetchCars();
    } catch { }
  };

  const handleTogglePopular = async (id: string, isPopular: boolean) => {
    try {
      await api.put(`/cars/admin/${id}`, { isPopular });
      fetchCars();
    } catch { }
  };

  const handleUpload = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await api.post('/cars/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls: string[] = res.data.data || [];
      if (isVideo) {
        setUploadedVideos(prev => [...prev, ...urls]);
      } else {
        setUploadedImages(prev => [...prev, ...urls]);
      }
      message.success('Upload successful');
    } catch {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
    return false; // prevent default upload
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload = {
        ...values,
        name: { zh: values.name_zh, en: values.name_en },
        description: { zh: values.description_zh || '', en: values.description_en || '' },
        images: uploadedImages,
        videos: uploadedVideos,
        specifications: {
          engine: values.engine,
          transmission: values.transmission,
          fuel: values.fuel,
          color: values.color,
          seats: values.seats,
          displacement: values.displacement,
        },
      };
      // Remove flat fields
      delete payload.name_zh; delete payload.name_en;
      delete payload.description_zh; delete payload.description_en;
      delete payload.engine; delete payload.transmission;
      delete payload.fuel; delete payload.color; delete payload.seats;
      delete payload.displacement;

      if (editingCar) {
        await api.put(`/cars/admin/${editingCar._id}`, payload);
        message.success('Car updated');
      } else {
        await api.post('/cars/admin/create', payload);
        message.success('Car created');
      }
      setModalOpen(false);
      fetchCars();
    } catch (err: any) {
      if (!err.errorFields) {
        message.error(err.response?.data?.message || 'Operation failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      width: 80,
      render: (imgs: string[]) => (
        <Image
          src={imgs?.[0] || 'https://via.placeholder.com/60x45?text=No+Image'}
          width={60}
          height={45}
          style={{ objectFit: 'cover', borderRadius: 6 }}
          preview={false}
        />
      ),
    },
    {
      title: 'Car Name',
      render: (r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.name?.zh}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{r.brand} · {r.year}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'new' ? 'green' : 'orange'}>
          {type === 'new' ? 'New' : 'Used'}
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => (
        <span style={{ color: '#e53e3e', fontWeight: 600 }}>
          ¥{price?.toLocaleString?.() || price}
        </span>
      ),
    },
    {
      title: 'Status',
      width: 80,
      render: (r: any) => (
        <Switch
          size="small"
          checked={r.isActive}
          onChange={v => handleToggleActive(r._id, v)}
        />
      ),
    },
    {
      title: 'Popular',
      width: 80,
      render: (r: any) => (
        <Switch
          size="small"
          checked={r.isPopular}
          onChange={v => handleTogglePopular(r._id, v)}
        />
      ),
    },
    {
      title: 'Actions',
      width: 120,
      render: (r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Confirm delete?" onConfirm={() => handleDelete(r._id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Car Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          Add Car
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={cars}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: setPage,
          showSizeChanger: false,
        }}
        style={{ background: 'white', borderRadius: 12 }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingCar ? 'Edit Car' : 'Add Car'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        width={800}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Tabs
            items={[
              {
                key: 'basic',
                label: 'Basic Info',
                children: (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="name_zh" label="Car Name (Chinese)" rules={[{ required: true }]}>
                          <Input placeholder="e.g. BMW 5 Series 2024" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="name_en" label="Car Name (English)" rules={[{ required: true }]}>
                          <Input placeholder="e.g. BMW 5 Series 2024" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                          <Select placeholder="Select type">
                            <Option value="new">New</Option>
                            <Option value="used">Used</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
                          <Select showSearch placeholder="Select brand">
                            {BRANDS.map(b => <Option key={b} value={b}>{b}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="model" label="Model" rules={[{ required: true }]}>
                          <Input placeholder="e.g. 5 Series" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} min={1990} max={2030} placeholder="2024" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="price" label="Price (CNY)" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} min={0} placeholder="498000" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="originalPrice" label="Original Price (CNY)">
                          <InputNumber style={{ width: '100%' }} min={0} placeholder="Optional, strikethrough price" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="category" label="Category">
                          <Select allowClear placeholder="Select category">
                            {categories.map(c => (
                              <Option key={c._id} value={c._id}>{c.name?.en || c.name?.zh}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="mileage" label="Mileage (km, for used cars)">
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="condition" label="Condition (used cars)">
                          <Input placeholder="e.g. Excellent/Good" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item name="description_zh" label="Description (Chinese)">
                      <TextArea rows={3} placeholder="Detailed description..." />
                    </Form.Item>
                    <Form.Item name="description_en" label="Description (English)">
                      <TextArea rows={3} placeholder="Describe the car in English..." />
                    </Form.Item>
                    <Form.Item name="features" label="Features (press Enter to separate)">
                      <Select mode="tags" placeholder="Enter features, press Enter" tokenSeparators={[',']} />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item name="isActive" label="Listing Status" valuePropName="checked" initialValue={true}>
                          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="isPopular" label="Popular" valuePropName="checked" initialValue={false}>
                          <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="sortOrder" label="Sort Order (smaller first)" initialValue={0}>
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ),
              },
              {
                key: 'specs',
                label: 'Specifications',
                children: (
                  <Row gutter={16}>
                    {[
                      { name: 'engine', label: 'Engine', placeholder: 'e.g. 2.0T' },
                      { name: 'transmission', label: 'Transmission', placeholder: 'e.g. 8AT' },
                      { name: 'fuel', label: 'Fuel Type', placeholder: 'Gasoline/Diesel/Electric/Hybrid' },
                      { name: 'color', label: 'Color', placeholder: 'e.g. Pearl White' },
                      { name: 'displacement', label: 'Displacement', placeholder: 'e.g. 2.0L' },
                    ].map(f => (
                      <Col span={12} key={f.name}>
                        <Form.Item name={f.name} label={f.label}>
                          <Input placeholder={f.placeholder} />
                        </Form.Item>
                      </Col>
                    ))}
                    <Col span={12}>
                      <Form.Item name="seats" label="Seats">
                        <InputNumber style={{ width: '100%' }} min={1} max={20} />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'media',
                label: 'Images & Videos',
                children: (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <Title level={5}>Upload Images</Title>
                      <Upload
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={handleUpload}
                      >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                          Select Images
                        </Button>
                        <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>
                          JPG/PNG/WEBP supported, max 50MB
                        </span>
                      </Upload>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {uploadedImages.map((url, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img
                              src={url}
                              alt=""
                              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              style={{
                                position: 'absolute', top: -6, right: -6,
                                width: 20, height: 20, padding: 0, borderRadius: '50%',
                              }}
                              onClick={() => setUploadedImages(imgs => imgs.filter((_, idx) => idx !== i))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <Divider />
                    <div>
                      <Title level={5}>Upload Videos</Title>
                      <Upload
                        accept="video/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={handleUpload}
                      >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                          Select Videos
                        </Button>
                        <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>
                          MP4/MOV supported, max 50MB
                        </span>
                      </Upload>
                      <div style={{ marginTop: 12 }}>
                        {uploadedVideos.map((url, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <video src={url} style={{ width: 120, height: 80, borderRadius: 8 }} controls />
                            <Button
                              size="small"
                              danger
                              onClick={() => setUploadedVideos(vs => vs.filter((_, idx) => idx !== i))}
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default CarManagement;
