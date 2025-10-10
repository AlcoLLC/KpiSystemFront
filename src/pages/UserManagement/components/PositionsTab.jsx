import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, message, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import SimpleCrudForm from './forms/SimpleCrudForm';
import { useDebounce } from '../../../hooks/useDebounce';

const PositionsTab = () => {
    const { items: positions, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('positions');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => { fetchData({ search: debouncedSearch }); }, [fetchData, debouncedSearch]);
    
    const handleOk = () => form.submit();
    const handleCancel = () => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); };

    const onFinish = async (values) => { /* ... (eyni qalır) ... */ };
    
    const columns = [ /* ... (eyni qalır) ... */ ];

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: 16 }}>
                 <Input.Search placeholder="Ada görə axtar..." onChange={e => setSearch(e.target.value)} allowClear />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Yeni Vəzifə</Button>
            </div>
            <Table columns={columns} dataSource={positions} rowKey="id" loading={loading} />
            <Modal title={editingItem ? 'Vəzifəni Redaktə Et' : 'Yeni Vəzifə Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <SimpleCrudForm form={form} onFinish={onFinish} initialValues={editingItem} itemName="Vəzifə" />
            </Modal>
        </div>
    );
};

export default PositionsTab;