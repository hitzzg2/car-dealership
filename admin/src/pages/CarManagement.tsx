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

const BRANDS = ['宝马', '奔驰', '奥迪', '丰田', '本田', '大众', '特斯拉', '比亚迪', '沃尔沃', '保时捷', '雷克萨斯', '凯迪拉克'];

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
      message.success('车辆已删除');
      fetchCars();
    } catch {
      message.error('删除失败');
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
      message.success('上传成功');
    } catch {
      message.error('上传失败');
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
        message.success('车辆更新成功');
      } else {
        await api.post('/cars/admin/create', payload);
        message.success('车辆创建成功');
      }
      setModalOpen(false);
      fetchCars();
    } catch (err: any) {
      if (!err.errorFields) {
        message.error(err.response?.data?.message || '操作失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: '图片',
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
      title: '车辆名称',
      render: (r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.name?.zh}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{r.brand} · {r.year}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'new' ? 'green' : 'orange'}>
          {type === 'new' ? '新车' : '二手车'}
        </Tag>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => (
        <span style={{ color: '#e53e3e', fontWeight: 600 }}>
          ¥{(price / 10000).toFixed(1)}万
        </span>
      ),
    },
    {
      title: '状态',
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
      title: '热门',
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
      title: '操作',
      width: 120,
      render: (r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r._id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>车辆管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          添加车辆
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
        title={editingCar ? '编辑车辆' : '添加车辆'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Tabs
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="name_zh" label="车辆名称（中文）" rules={[{ required: true }]}>
                          <Input placeholder="如：宝马 5系 2024款" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="name_en" label="车辆名称（英文）" rules={[{ required: true }]}>
                          <Input placeholder="e.g. BMW 5 Series 2024" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                          <Select placeholder="选择类型">
                            <Option value="new">新车</Option>
                            <Option value="used">二手车</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="brand" label="品牌" rules={[{ required: true }]}>
                          <Select showSearch placeholder="选择品牌">
                            {BRANDS.map(b => <Option key={b} value={b}>{b}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="model" label="车型" rules={[{ required: true }]}>
                          <Input placeholder="如：5系" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="year" label="年份" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} min={1990} max={2030} placeholder="2024" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="price" label="售价（元）" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} min={0} placeholder="498000" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="originalPrice" label="原价（元）">
                          <InputNumber style={{ width: '100%' }} min={0} placeholder="选填，划线价" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="category" label="分类">
                          <Select allowClear placeholder="选择分类">
                            {categories.map(c => (
                              <Option key={c._id} value={c._id}>{c.name?.zh}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="mileage" label="里程数（公里，二手车填）">
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="condition" label="车况（二手车）">
                          <Input placeholder="如：极好/良好" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item name="description_zh" label="车辆描述（中文）">
                      <TextArea rows={3} placeholder="详细描述车辆特点..." />
                    </Form.Item>
                    <Form.Item name="description_en" label="车辆描述（英文）">
                      <TextArea rows={3} placeholder="Describe the car in English..." />
                    </Form.Item>
                    <Form.Item name="features" label="配置亮点（回车分隔）">
                      <Select mode="tags" placeholder="输入配置，回车确认" tokenSeparators={[',']} />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item name="isActive" label="上架状态" valuePropName="checked" initialValue={true}>
                          <Switch checkedChildren="上架" unCheckedChildren="下架" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="isPopular" label="热门推荐" valuePropName="checked" initialValue={false}>
                          <Switch checkedChildren="是" unCheckedChildren="否" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="sortOrder" label="排序（越小越靠前）" initialValue={0}>
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ),
              },
              {
                key: 'specs',
                label: '车辆参数',
                children: (
                  <Row gutter={16}>
                    {[
                      { name: 'engine', label: '发动机', placeholder: '如：2.0T' },
                      { name: 'transmission', label: '变速箱', placeholder: '如：8AT' },
                      { name: 'fuel', label: '燃油类型', placeholder: '汽油/柴油/电动/混动' },
                      { name: 'color', label: '颜色', placeholder: '如：珍珠白' },
                      { name: 'displacement', label: '排量', placeholder: '如：2.0L' },
                    ].map(f => (
                      <Col span={12} key={f.name}>
                        <Form.Item name={f.name} label={f.label}>
                          <Input placeholder={f.placeholder} />
                        </Form.Item>
                      </Col>
                    ))}
                    <Col span={12}>
                      <Form.Item name="seats" label="座位数">
                        <InputNumber style={{ width: '100%' }} min={1} max={20} />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'media',
                label: '图片/视频',
                children: (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <Title level={5}>上传图片</Title>
                      <Upload
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={handleUpload}
                      >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                          选择图片
                        </Button>
                        <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>
                          支持 JPG/PNG/WEBP，最大 50MB
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
                      <Title level={5}>上传视频</Title>
                      <Upload
                        accept="video/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={handleUpload}
                      >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                          选择视频
                        </Button>
                        <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>
                          支持 MP4/MOV，最大 50MB
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
                              删除
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
