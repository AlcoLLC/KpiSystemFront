import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Table, Space, Modal, message, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import DepartmentForm from './forms/DepartmentForm';
import { useDebounce } from '../../../hooks/useDebounce';

// Modal-dan `useModal` hook-unu çıxarırıq
const { useModal } = Modal;

const DepartmentsTab = () => {
    const { items: departments, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('departments');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Hook-u komponentin içində çağırırıq
    const [modal, contextHolder] = useModal();

    useEffect(() => { fetchData({ search: debouncedSearch || undefined }); }, [fetchData, debouncedSearch]);

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
    
    const columns = useMemo(() => [
        { title: 'Departament Adı', dataIndex: 'name', key: 'name' },
        {
            title: 'Əməliyyatlar', key: 'action', width: 120,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => {
                        // Statik `Modal.confirm` əvəzinə hook-dan gələn `modal.confirm` istifadə edirik
                        modal.confirm({
                            title: 'Əminsinizmi?',
                            content: `${record.name} adlı departamenti silmək istəyirsiniz?`,
                            okText: 'Bəli',
                            cancelText: 'Xeyr',
                            okType: 'danger',
                            onOk: async () => {
                                try {
                                    await deleteItem(record.id);
                                    message.success('Departament silindi.');
                                } catch {
                                    message.error('Departamenti silmək mümkün olmadı.');
                                }
                            }
                        });
                    }} />
                </Space>
            ),
        },
    ], [form, deleteItem, modal]); // `modal` obyektini asılılıq siyahısına əlavə edirik

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                <Input.Search placeholder="Ada görə axtar..." onSearch={setSearch} allowClear className="flex-1 min-w-[200px]" />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>Yeni Departament</Button>
            </div>
            
            <Table columns={columns} dataSource={departments} rowKey="id" loading={loading} />
            
            <Modal title={editingItem ? 'Departamenti Redaktə Et' : 'Yeni Departament Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={(_, { OkBtn, CancelBtn }) => <><CancelBtn /><Button type="primary" onClick={handleOk}>Yadda Saxla</Button></>}>
                <DepartmentForm form={form} onFinish={onFinish} initialValues={editingItem} />
            </Modal>

             {contextHolder}
        </div>
    );
};

export default DepartmentsTab;