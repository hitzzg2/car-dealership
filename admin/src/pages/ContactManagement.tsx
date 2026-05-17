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
  phone: 'Phone',
  email: 'Email',
  address: 'Address',
  wechat: 'WeChat',
  social: 'Other',
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
      message.success('Contact deleted');
      fetch();
    } catch { message.error('Delete failed'); }
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
        message.success('Updated');
      } else {
        await api.post('/contacts/admin/create', payload);
        message.success('Added');
      }
      setModalOpen(false);
      fetch();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.response?.data?.message || 'Operation failed');
    } finally { setSubmitting(false); }
  };

  const columns = [
    { title: 'Type', dataIndex: 'type', width: 80, render: (t: string) => <Tag>{typeLabels[t] || t}</Tag> },
    { title: 'Label (Chinese)', render: (r: any) => r.label?.zh },
    { title: 'Label (English)', render: (r: any) => r.label?.en },
    { title: 'Value', dataIndex: 'value' },
    { title: 'Icon', dataIndex: 'icon' },
    { title: 'Sort', dataIndex: 'sortOrder', width: 60 },
    {
      title: 'Public Display',
      width: 80,
      render: (r: any) => (
        <Switch size="small" checked={r.isPublic}
          onChange={async v => { await api.put(`/contacts/admin/${r._id}`, { isPublic: v }); fetch(); }}
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
        <Title level={4} style={{ margin: 0 }}>Contact Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#1a2035', borderColor: '#1a2035' }}>
          Add Contact
        </Button>
      </div>

      <Table columns={columns} dataSource={contacts} rowKey="_id" loading={loading}
        pagination={false} style={{ background: 'white', borderRadius: 12 }} />

      <Modal
        title={editingItem ? 'Edit Contact' : 'Add Contact'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={submitting}
        okText="Save" cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select contact type">
              {Object.entries(typeLabels).map(([v, l]) => (
                <Option key={v} value={v}>{l}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="label_zh" label="Label (Chinese)" rules={[{ required: true }]}>
            <Input placeholder="e.g. Sales Hotline" />
          </Form.Item>
          <Form.Item name="label_en" label="Label (English)">
            <Input placeholder="e.g. Sales Hotline" />
          </Form.Item>
          <Form.Item name="value" label="Value" rules={[{ required: true }]}>
            <Input placeholder="e.g. 400-888-8888" />
          </Form.Item>
          <Form.Item name="icon" label="Icon Name (Ant Design icon)">
            <Input placeholder="e.g. phone / mail / environment" />
          </Form.Item>
          <Form.Item name="sortOrder" label="Sort Order" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isPublic" label="Public Display" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactManagement;
