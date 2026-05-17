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
      message.success('Promotion deleted');
      fetch();
    } catch { message.error('Delete failed'); }
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
      message.success('Image uploaded');
    } catch { message.error('Upload failed'); }
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
        message.success('Updated');
      } else {
        await api.post('/promotions/admin/create', payload);
        message.success('Created');
      }
      setModalOpen(false);
      fetch();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.response?.data?.message || 'Operation failed');
    } finally { setSubmitting(false); }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: 80,
      render: (img: string) => img ? (
        <Image src={img} width={60} height={40} style={{ objectFit: 'cover', borderRadius: 6 }} preview={false} />
      ) : '-',
    },
    { title: 'Title', render: (r: any) => r.title?.zh },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'banner' ? 'blue' : type === 'special' ? 'red' : 'orange'}>
          {type === 'banner' ? 'Banner' : type === 'special' ? 'Special' : 'Discount'}
        </Tag>
      ),
    },
    {
      title: 'Valid Period',
      render: (r: any) => (
        <span style={{ fontSize: 12, color: '#666' }}>
          {new Date(r.startDate).toLocaleDateString('en-US')} ~{' '}
          {new Date(r.endDate).toLocaleDateString('en-US')}
        </span>
      ),
    },
    {
      title: 'Status',
      width: 80,
      render: (r: any) => (
        <Switch size="small" checked={r.isActive}
          onChange={async v => { await api.put(`/promotions/admin/${r._id}`, { isActive: v }); fetch(); }}
        />
      ),
    },
    {
      title: 'Actions',
      width: 100,
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
        <Title level={4} style={{ margin: 0 }}>Promotion & Banner Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          Add Promotion
        </Button>
      </div>

      <Table columns={columns} dataSource={promotions} rowKey="_id" loading={loading}
        pagination={false} style={{ background: 'white', borderRadius: 12 }} />

      <Modal
        title={editingItem ? 'Edit Promotion' : 'Add Promotion'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        width={640}
        okText="Save" cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="banner">Banner</Option>
              <Option value="discount">Discount</Option>
              <Option value="special">Special Offer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title_zh" label="Title (Chinese)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title_en" label="Title (English)">
            <Input />
          </Form.Item>
          <Form.Item name="description_zh" label="Description (Chinese)">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="description_en" label="Description (English)">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Promotion Image" required>
            <Upload accept="image/*" showUploadList={false} beforeUpload={handleUpload}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {uploadedImage && (
              <img src={uploadedImage} alt="" style={{ marginTop: 8, width: 200, borderRadius: 8 }} />
            )}
          </Form.Item>
          <Form.Item name="link" label="Link">
            <Input placeholder="/cars?type=new" />
          </Form.Item>
          <Form.Item name="dateRange" label="Valid Period" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
