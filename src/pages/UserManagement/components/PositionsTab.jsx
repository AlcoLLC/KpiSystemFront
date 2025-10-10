import React, { useState, useEffect, useMemo } from 'react';
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

    const onFinish = async (values) => {
        try {
            if (editingItem) {
                await updateItem(editingItem.id, values);
                message.success('Vəzifə uğurla yeniləndi!');
            } else {
                await createItem(values);
                message.success('Vəzifə uğurla yaradıldı!');
            }
            handleCancel();
        } catch (error) { message.error('Əməliyyat uğursuz oldu.'); }
    };
    
    const columns = useMemo(() => [
        { title: 'Vəzifə Adı', dataIndex: 'name', key: 'name' },
        {
            title: 'Əməliyyatlar', key: 'action', width: 120,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => {
                        Modal.confirm({
                            title: 'Əminsinizmi?', content: `${record.name} adlı vəzifəni silmək istəyirsiniz?`, okText: 'Bəli', cancelText: 'Xeyr',
                            onOk: async () => {
                                try { await deleteItem(record.id); message.success('Vəzifə silindi.'); }
                                catch { message.error('Vəzifəni silmək mümkün olmadı.'); }
                            }
                        });
                    }} />
                </Space>
            ),
        },
    ], [form, deleteItem]);

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                 <Input.Search placeholder="Ada görə axtar..." onChange={e => setSearch(e.target.value)} allowClear className="flex-1 min-w-[200px]" />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>Yeni Vəzifə</Button>
            </div>
            <Table columns={columns} dataSource={positions} rowKey="id" loading={loading} />
            <Modal title={editingItem ? 'Vəzifəni Redaktə Et' : 'Yeni Vəzifə Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={(_, { OkBtn, CancelBtn }) => <><CancelBtn /><Button type="primary" onClick={handleOk}>Yadda Saxla</Button></>}>
                <SimpleCrudForm form={form} onFinish={onFinish} initialValues={editingItem} itemName="Vəzifə" />
            </Modal>
        </div>
    );
};

export default PositionsTab;