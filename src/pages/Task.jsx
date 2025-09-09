import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag, Space, Table, Modal, Form, Input, Select, DatePicker } from 'antd';

const { Option } = Select;

// ================== Table Configs ==================
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Project Name', dataIndex: 'project', key: 'project' },
  { title: 'Company', dataIndex: 'company', key: 'company' },
  { title: 'Start Date', dataIndex: 'start', key: 'start' },
  { title: 'End Date', dataIndex: 'end', key: 'end' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '';
      if (status === 'In Progress') color = 'orange';
      else if (status === 'Pending') color = 'green';
      else if (status === 'Completed') color = 'blue';
      else if (status === 'Not Started') color = 'red';
      return <Tag color={color}>{status}</Tag>;
    }
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EyeOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
        <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
      </Space>
    )
  }
];

// ================== Table Data ==================
const initialData = [
  {
    id: '#951',
    project: 'Hotel management system',
    company: 'Vaxo Corporation',
    start: '15 Nov, 2025',
    end: '15 Dec, 2025',
    status: 'In Progress'
  },
  {
    id: '#547',
    project: 'Product development',
    company: 'Beja Ltd',
    start: '14 Nov, 2025',
    end: '14 Dec, 2025',
    status: 'Pending'
  },
  {
    id: '#658',
    project: 'Python upgrade',
    company: 'Aegis Industries',
    start: '13 Nov, 2025',
    end: '13 Dec, 2025',
    status: 'Completed'
  },
  {
    id: '#367',
    project: 'Project monitoring',
    company: 'Affort Solutions',
    start: '12 Nov, 2025',
    end: '12 Dec, 2025',
    status: 'Not Started'
  }
];

function Task() {
  const isDark = useSelector((state) => state.theme.isDark);

  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newTask = {
          id: `#${Math.floor(Math.random() * 1000)}`,
          project: values.project,
          company: values.company,
          start: values.start.format('DD MMM, YYYY'),
          end: values.end.format('DD MMM, YYYY'),
          status: values.status
        };
        setData([...data, newTask]);
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div>
      <h2 className={`px-1 text-xl font-bold mb-6 ${isDark ? ' text-white' : ' text-black'}`}>
        Tapşırıqlar
      </h2>

      <div
        className={`p-6 rounded-lg shadow-md transition duration-500 ${
          isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Add Task Button */}
        <button
          onClick={showModal}
          className={`p-2 text-xl mb-6 transition duration-500 border rounded
    ${
      isDark
        ? 'text-white border-white hover:bg-gray-500'
        : 'text-[#3379F5] border-blue-500 hover:bg-gray-200'
    }`}
        >
          + Add new task
        </button>

        {/* Table Section */}
        <div
          className={`p-4 rounded-lg shadow transition duration-500 ${
            isDark ? 'bg-[#131920]' : ''
          }`}
        >
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
            className={isDark ? 'dark-table' : 'light-table'}
            rowClassName={() =>
              isDark
                ? 'bg-[#1B232D] text-white hover:bg-[#2A3440]'
                : 'bg-white text-black hover:bg-gray-100'
            }
          />
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        title="Add New Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="project"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please enter company name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="start"
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker format="DD MMM, YYYY" />
          </Form.Item>
          <Form.Item
            name="end"
            label="End Date"
            rules={[{ required: true, message: 'Please select end date!' }]}
          >
            <DatePicker format="DD MMM, YYYY" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="In Progress">In Progress</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Not Started">Not Started</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Task;
