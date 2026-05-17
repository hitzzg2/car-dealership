import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, message, Popconfirm, Switch, Modal,
  Form, Input, Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories/admin/list');
      setCategories(res.data.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      name_zh: item.name?.zh,
      name_en: item.name?.en,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/admin/${id}`);
      message.success('Category deleted');
      fetch();
    } catch { message.error('Delete failed'); }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload = {
        ...values,
        name: { zh: values.name_zh, en: values.name_en || values.name_zh },
      };
      delete payload.name_zh; delete payload.name_en;

      if (editingItem) {
        await api.put(`/categories/admin/${editingItem._id}`, payload);
        message.success('Category updated');
      } else {
        await api.post('/categories/admin/create', payload);
        message.success('Category created');
      }
      setModalOpen(false);
      fetch();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: 'Chinese Name', render: (r: any) => r.name?.zh },
    { title: 'English Name', render: (r: any) => r.name?.en },
    { title: 'Slug', dataIndex: 'slug' },
    { title: 'Icon', dataIndex: 'icon' },
    { title: 'Sort', dataIndex: 'sortOrder', width: 80 },
    {
      title: 'Status',
      width: 80,
      render: (r: any) => (
        <Switch
          size="small"
          checked={r.isActive}
          onChange={async v => {
            await api.put(`/categories/admin/${r._id}`, { isActive: v });
            fetch();
          }}
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
        <Title level={4} style={{ margin: 0 }}>Category Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          Add Category
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="_id" loading={loading}
        pagination={false} style={{ background: 'white', borderRadius: 12 }} />

      <Modal
        title={editingItem ? 'Edit Category' : 'Add Category'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        okText="Save" cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name_zh" label="Category Name (Chinese)" rules={[{ required: true }]}>
            <Input placeholder="e.g. New Cars" />
          </Form.Item>
          <Form.Item name="name_en" label="Category Name (English)">
            <Input placeholder="e.g. New Cars" />
          </Form.Item>
          <Form.Item name="slug" label="Slug (URL identifier)" rules={[{ required: true }]}>
            <Input placeholder="e.g. new-cars" />
          </Form.Item>
          <Form.Item name="icon" label="Icon Name">
            <Input placeholder="e.g. car / star / thunderbolt" />
          </Form.Item>
          <Form.Item name="sortOrder" label="Sort Order" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
