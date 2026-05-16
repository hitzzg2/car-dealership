import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, message, Popconfirm, Switch, Modal,
  Form, Input, Select, Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Option } = Select;
const { Title } = Typography;

const typeLabels: Record<string, string> = {
  phone: '电话',
  email: '邮箱',
  address: '地址',
  wechat: '微信',
  social: '其他',
};

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts/admin/list');
      setContacts(res.data.data || []);
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
      label_zh: item.label?.zh,
      label_en: item.label?.en,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contacts/admin/${id}`);
      message.success('联系信息已删除');
      fetch();
    } catch { message.error('删除失败'); }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload = {
        ...values,
        label: { zh: values.label_zh, en: values.label_en || values.label_zh },
      };
      delete payload.label_zh; delete payload.label_en;
      if (editingItem) {
        await api.put(`/contacts/admin/${editingItem._id}`, payload);
        message.success('已更新');
      } else {
        await api.post('/contacts/admin/create', payload);
        message.success('已添加');
      }
      setModalOpen(false);
      fetch();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.response?.data?.message || '操作失败');
    } finally { setSubmitting(false); }
  };

  const columns = [
    { title: '类型', dataIndex: 'type', width: 80, render: (t: string) => <Tag>{typeLabels[t] || t}</Tag> },
    { title: '标签（中文）', render: (r: any) => r.label?.zh },
    { title: '标签（英文）', render: (r: any) => r.label?.en },
    { title: '内容', dataIndex: 'value' },
    { title: '图标', dataIndex: 'icon' },
    { title: '排序', dataIndex: 'sortOrder', width: 60 },
    {
      title: '公开显示',
      width: 80,
      render: (r: any) => (
        <Switch size="small" checked={r.isPublic}
          onChange={async v => { await api.put(`/contacts/admin/${r._id}`, { isPublic: v }); fetch(); }}
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
        <Title level={4} style={{ margin: 0 }}>联系信息管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          添加联系方式
        </Button>
      </div>

      <Table columns={columns} dataSource={contacts} rowKey="_id" loading={loading}
        pagination={false} style={{ background: 'white', borderRadius: 12 }} />

      <Modal
        title={editingItem ? '编辑联系信息' : '添加联系信息'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        okText="保存" cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select placeholder="选择联系方式类型">
              {Object.entries(typeLabels).map(([v, l]) => (
                <Option key={v} value={v}>{l}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="label_zh" label="标签（中文）" rules={[{ required: true }]}>
            <Input placeholder="如：销售热线" />
          </Form.Item>
          <Form.Item name="label_en" label="标签（英文）">
            <Input placeholder="e.g. Sales Hotline" />
          </Form.Item>
          <Form.Item name="value" label="内容" rules={[{ required: true }]}>
            <Input placeholder="如：400-888-8888" />
          </Form.Item>
          <Form.Item name="icon" label="图标名称（Ant Design icon）">
            <Input placeholder="如：phone / mail / environment" />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isPublic" label="公开显示" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactManagement;
