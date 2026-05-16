import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, message, Popconfirm, Switch, Modal,
  Form, Input, Select, Upload, DatePicker, Typography, Image
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/promotions/admin/list');
      setPromotions(res.data.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setUploadedImage('');
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      title_zh: item.title?.zh,
      title_en: item.title?.en,
      description_zh: item.description?.zh,
      description_en: item.description?.en,
      type: item.type,
      link: item.link,
      dateRange: [dayjs(item.startDate), dayjs(item.endDate)],
      isActive: item.isActive,
    });
    setUploadedImage(item.image || '');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/promotions/admin/${id}`);
      message.success('促销活动已删除');
      fetch();
    } catch { message.error('删除失败'); }
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await api.post('/cars/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls: string[] = res.data.data || [];
      if (urls[0]) setUploadedImage(urls[0]);
      message.success('图片上传成功');
    } catch { message.error('上传失败'); }
    return false;
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const [startDate, endDate] = values.dateRange || [];
      const payload = {
        title: { zh: values.title_zh, en: values.title_en || values.title_zh },
        description: { zh: values.description_zh || '', en: values.description_en || '' },
        type: values.type,
        link: values.link,
        image: uploadedImage,
        startDate: startDate?.toDate(),
        endDate: endDate?.toDate(),
        isActive: values.isActive !== false,
      };
      if (editingItem) {
        await api.put(`/promotions/admin/${editingItem._id}`, payload);
        message.success('已更新');
      } else {
        await api.post('/promotions/admin/create', payload);
        message.success('已创建');
      }
      setModalOpen(false);
      fetch();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.response?.data?.message || '操作失败');
    } finally { setSubmitting(false); }
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      width: 80,
      render: (img: string) => img ? (
        <Image src={img} width={60} height={40} style={{ objectFit: 'cover', borderRadius: 6 }} preview={false} />
      ) : '-',
    },
    { title: '标题', render: (r: any) => r.title?.zh },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'banner' ? 'blue' : type === 'special' ? 'red' : 'orange'}>
          {type === 'banner' ? '轮播图' : type === 'special' ? '特惠' : '折扣'}
        </Tag>
      ),
    },
    {
      title: '有效期',
      render: (r: any) => (
        <span style={{ fontSize: 12, color: '#666' }}>
          {new Date(r.startDate).toLocaleDateString('zh-CN')} ~{' '}
          {new Date(r.endDate).toLocaleDateString('zh-CN')}
        </span>
      ),
    },
    {
      title: '状态',
      width: 80,
      render: (r: any) => (
        <Switch size="small" checked={r.isActive}
          onChange={async v => { await api.put(`/promotions/admin/${r._id}`, { isActive: v }); fetch(); }}
        />
      ),
    },
    {
      title: '操作',
      width: 100,
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
        <Title level={4} style={{ margin: 0 }}>促销/轮播管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          添加促销
        </Button>
      </div>

      <Table columns={columns} dataSource={promotions} rowKey="_id" loading={loading}
        pagination={false} style={{ background: 'white', borderRadius: 12 }} />

      <Modal
        title={editingItem ? '编辑促销' : '添加促销'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        width={640}
        okText="保存" cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select placeholder="选择类型">
              <Option value="banner">轮播Banner</Option>
              <Option value="discount">折扣活动</Option>
              <Option value="special">特惠专场</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title_zh" label="标题（中文）" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title_en" label="标题（英文）">
            <Input />
          </Form.Item>
          <Form.Item name="description_zh" label="描述（中文）">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="description_en" label="描述（英文）">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label="促销图片" required>
            <Upload accept="image/*" showUploadList={false} beforeUpload={handleUpload}>
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
            {uploadedImage && (
              <img src={uploadedImage} alt="" style={{ marginTop: 8, width: 200, borderRadius: 8 }} />
            )}
          </Form.Item>
          <Form.Item name="link" label="跳转链接">
            <Input placeholder="/cars?type=new" />
          </Form.Item>
          <Form.Item name="dateRange" label="有效期" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isActive" label="立即启用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
