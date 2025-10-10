import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, message, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import DepartmentForm from './forms/DepartmentForm'; // <-- Yeni formanı import edirik
import { useDebounce } from '../../../hooks/useDebounce';

const DepartmentsTab = () => {
    const { items: departments, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('departments');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => { fetchData({ search: debouncedSearch }); }, [fetchData, debouncedSearch]);

    const handleOk = () => form.submit();
    const handleCancel = () => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); };

    const onFinish = async (values) => {
        try {
            if (editingItem) {
                await updateItem(editingItem.id, values);
                message.success('Departament uğurla yeniləndi!');
            } else {
                await createItem(values);
                message.success('Departament uğurla yaradıldı!');
            }
            handleCancel();
        } catch (error) { message.error('Əməliyyat uğursuz oldu.'); }
    };
    
    const columns = [ /* ... (eyni qalır) ... */ ];

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: 16 }}>
                <Input.Search placeholder="Ada görə axtar..." onChange={e => setSearch(e.target.value)} allowClear />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Yeni Departament</Button>
            </div>
            <Table columns={columns} dataSource={departments} rowKey="id" loading={loading} />
            <Modal title={editingItem ? 'Departamenti Redaktə Et' : 'Yeni Departament Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <DepartmentForm form={form} onFinish={onFinish} initialValues={editingItem} />
            </Modal>
        </div>
    );
};

export default DepartmentsTab;
