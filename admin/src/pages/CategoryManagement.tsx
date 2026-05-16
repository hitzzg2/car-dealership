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
      message.success('分类已删除');
      fetch();
    } catch { message.error('删除失败'); }
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
        message.success('分类已更新');
      } else {
        await api.post('/categories/admin/create', payload);
        message.success('分类已创建');
      }
      setModalOpen(false);
      fetch();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.response?.data?.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: '中文名称', render: (r: any) => r.name?.zh },
    { title: '英文名称', render: (r: any) => r.name?.en },
    { title: 'Slug', dataIndex: 'slug' },
    { title: '图标', dataIndex: 'icon' },
    { title: '排序', dataIndex: 'sortOrder', width: 80 },
    {
      title: '状态',
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
        <Title level={4} style={{ margin: 0 }}>分类管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          添加分类
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="_id" loading={loading}
        pagination={false} style={{ background: 'white', borderRadius: 12 }} />

      <Modal
        title={editingItem ? '编辑分类' : '添加分类'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        okText="保存" cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name_zh" label="分类名称（中文）" rules={[{ required: true }]}>
            <Input placeholder="如：新车" />
          </Form.Item>
          <Form.Item name="name_en" label="分类名称（英文）">
            <Input placeholder="e.g. New Cars" />
          </Form.Item>
          <Form.Item name="slug" label="Slug（URL标识）" rules={[{ required: true }]}>
            <Input placeholder="如：new-cars" />
          </Form.Item>
          <Form.Item name="icon" label="图标名称">
            <Input placeholder="如：car / star / thunderbolt" />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
