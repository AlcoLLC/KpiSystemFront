import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  Tag,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Descriptions,
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const columnsFactory = (onEdit, onDelete) => [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Başlıq', dataIndex: 'title', key: 'title' },
  { title: 'Başlama tarixi', dataIndex: 'start_date', key: 'start_date' },
  { title: 'Bitmə tarixi', dataIndex: 'due_date', key: 'due_date' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '';
      if (status === 'IN_PROGRESS' || status === 'In Progress') color = 'orange';
      else if (status === 'TODO' || status === 'Pending') color = 'green';
      else if (status === 'DONE' || status === 'Completed') color = 'blue';
      else color = 'red';

      const labelMap = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        DONE: 'Done',
        Pending: 'Pending',
        Completed: 'Completed',
      };
      const label = labelMap[status] || status;
      return <Tag color={color}>{label}</Tag>;
    },
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditOutlined
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
        />
        <DeleteOutlined
          style={{ color: '#ff4d4f', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
        />
      </Space>
    ),
  },
];

const initialData = [
  {
    id: '#951',
    title: 'Hotel management system',
    start_date: '15 Nov, 2025',
    due_date: '15 Dec, 2025',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'User 1',
    description: 'Booking & room management.',
    estimated_hours: 120,
  },
  {
    id: '#547',
    title: 'Product development',
    start_date: '14 Nov, 2025',
    due_date: '14 Dec, 2025',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: 'User 2',
    description: 'New product v2.',
    estimated_hours: 80,
  },
];

function Task() {
  const isDark = useSelector((state) => state.theme.isDark);

  const [data, setData] = useState(initialData);

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);

  const [form] = Form.useForm();

  const handleAddClick = () => {
    setMode('add');
    form.resetFields();
    setCurrentRecord(null);
    setIsAddEditOpen(true);
  };

  const handleEdit = (record) => {
    setMode('edit');
    setCurrentRecord(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      priority: record.priority,
      assignee: record.assignee,
      start_date: record.start_date ? dayjs(record.start_date, 'DD MMM, YYYY') : null,
      due_date: record.due_date ? dayjs(record.due_date, 'DD MMM, YYYY') : null,
      estimated_hours: record.estimated_hours,
      status: record.status,
    });
    setIsAddEditOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Silinsin?',
      content: `Task ${record.title} silinsin?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk() {
        setData((prev) => prev.filter((r) => r.id !== record.id));
      },
    });
  };

  const handleRowClick = (record) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };

  const handleAddEditOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        id: mode === 'add' ? `#${Math.floor(Math.random() * 900 + 100)}` : currentRecord.id,
        title: values.title,
        description: values.description,
        priority: values.priority,
        assignee: values.assignee,
        start_date: values.start_date ? values.start_date.format('DD MMM, YYYY') : null,
        due_date: values.due_date ? values.due_date.format('DD MMM, YYYY') : null,
        estimated_hours: values.estimated_hours,
        status: values.status || 'TODO',
      };

      if (mode === 'add') {
        setData((prev) => [...prev, payload]);
      } else {
        setData((prev) => prev.map((r) => (r.id === payload.id ? payload : r)));
      }

      form.resetFields();
      setIsAddEditOpen(false);
    });
  };

  const handleAddEditCancel = () => {
    form.resetFields();
    setIsAddEditOpen(false);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setCurrentRecord(null);
  };

  const columns = columnsFactory(handleEdit, handleDelete);

  return (
    <div>
      <h2 className={`px-1 text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
        Tapşırıqlar
      </h2>

      <div
        className={`p-6 rounded-lg shadow-md transition duration-500 ${
          isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
        }`}
      >
        <button
          onClick={handleAddClick}
          className={`p-2 text-xl mb-6 transition duration-500 border rounded
            ${
              isDark
                ? 'text-white border-white hover:bg-gray-500'
                : 'text-[#3379F5] border-blue-500 hover:bg-gray-200'
            }`}
        >
          + Tapşırıq əlavə et
        </button>

        <div className={`p-4 rounded-lg shadow transition duration-500 ${isDark ? 'bg-[#131920]' : ''}`}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
            className={isDark ? 'dark-table' : 'light-table'}
            rowClassName={() =>
              isDark
                ? 'bg-[#1B232D] text-white hover:bg-[#2A3440] cursor-pointer'
                : 'bg-white text-black hover:bg-gray-100 cursor-pointer'
            }
            onRow={(record) => ({ onClick: () => handleRowClick(record) })}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title={<span className={isDark ? 'text-white' : 'text-black'}>{mode === 'add' ? 'Yeni Tapşırıq' : 'Tapşırığı Redaktə et'}</span>}
        open={isAddEditOpen}
        onOk={handleAddEditOk}
        onCancel={handleAddEditCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        width={800}
        className={isDark ? 'dark-modal' : ''}
        closeIcon={<span style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold', fontSize: '16px' }}>×</span>}
        bodyStyle={{
          backgroundColor: isDark ? '#1B232D' : '#fff',
          color: isDark ? 'white' : 'black',
          borderRadius: '12px',
        }}
        okButtonProps={{
          style: isDark
            ? { backgroundColor: '#3379F5', borderColor: '#3379F5', color: '#fff' }
            : {},
        }}
        cancelButtonProps={{
          style: isDark ? { color: '#fff', borderColor: '#2A3442', backgroundColor: '#131920' } : {},
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label={<span className={isDark ? 'text-white' : 'text-black'}>Başlıq</span>}
            rules={[{ required: true, message: 'Zəhmət olmasa başlıq daxil edin!' }]}
          >
            <Input className={isDark ? 'antd-dark-input' : ''} />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className={isDark ? 'text-white' : 'text-black'}>Təsvir</span>}
          >
            <Input.TextArea rows={3} className={isDark ? 'antd-dark-input' : ''} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="priority"
              label={<span className={isDark ? 'text-white' : 'text-black'}>Prioritet</span>}
              rules={[{ required: true, message: 'Zəhmət olmasa prioritet seçin!' }]}
            >
              <Select
                className={isDark ? 'antd-dark-select' : ''}
                dropdownClassName={isDark ? 'antd-dark-select-dropdown' : ''}
                placeholder="Seçin"
              >
                <Option value="CRITICAL">Kritik</Option>
                <Option value="HIGH">Yüksək</Option>
                <Option value="MEDIUM">Orta</Option>
                <Option value="LOW">Aşağı</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="assignee"
              label={<span className={isDark ? 'text-white' : 'text-black'}>İcraçı</span>}
              rules={[{ required: true, message: 'Zəhmət olmasa icraçı seçin!' }]}
            >
              <Select
                className={isDark ? 'antd-dark-select' : ''}
                dropdownClassName={isDark ? 'antd-dark-select-dropdown' : ''}
                placeholder="Seçin"
              >
                <Option value="User 1">User 1</Option>
                <Option value="User 2">User 2</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="start_date"
              label={<span className={isDark ? 'text-white' : 'text-black'}>Başlama tarixi</span>}
            >
              <DatePicker format="DD MMM, YYYY" className={isDark ? 'antd-dark-picker' : ''} />
            </Form.Item>

            <Form.Item
              name="due_date"
              label={<span className={isDark ? 'text-white' : 'text-black'}>Bitmə tarixi</span>}
            >
              <DatePicker format="DD MMM, YYYY" className={isDark ? 'antd-dark-picker' : ''} />
            </Form.Item>

            <Form.Item
              name="estimated_hours"
              label={<span className={isDark ? 'text-white' : 'text-black'}>Planlanan saat</span>}
            >
              <Input type="number" min={0} step={0.5} className={isDark ? 'antd-dark-input' : ''} />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label={<span className={isDark ? 'text-white' : 'text-black'}>Status</span>}
            initialValue={'TODO'}
          >
            <Select className={isDark ? 'antd-dark-select' : ''} dropdownClassName={isDark ? 'antd-dark-select-dropdown' : ''}>
              <Option value="TODO">To Do</Option>
              <Option value="IN_PROGRESS">In Progress</Option>
              <Option value="DONE">Done</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={<span className={isDark ? 'text-white' : 'text-black'}>Tapşırıq Məlumatları</span>}
        open={isViewOpen}
        onCancel={handleViewClose}
        width={700}
        className={isDark ? 'dark-modal' : ''}
        closeIcon={<span style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold', fontSize: '16px' }}>×</span>}
        footer={null}
        bodyStyle={{
          backgroundColor: isDark ? '#1B232D' : '#fff',
        }}
      >
        {currentRecord && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '500' }}
            contentStyle={{ color: isDark ? '#ffffff' : '#000000' }}
          >
            <Descriptions.Item label="ID">{currentRecord.id}</Descriptions.Item>
            <Descriptions.Item label="Başlıq">{currentRecord.title}</Descriptions.Item>
            <Descriptions.Item label="Təsvir">{currentRecord.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="İcraçı">{currentRecord.assignee || '-'}</Descriptions.Item>
            <Descriptions.Item label="Prioritet">{currentRecord.priority || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status">{currentRecord.status || '-'}</Descriptions.Item>
            <Descriptions.Item label="Başlama tarixi">{currentRecord.start_date || '-'}</Descriptions.Item>
            <Descriptions.Item label="Bitmə tarixi">{currentRecord.due_date || '-'}</Descriptions.Item>
            <Descriptions.Item label="Planlanan saat">{currentRecord.estimated_hours || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Task;
