import { useState, useEffect, useMemo } from 'react';
import { Table, Space, Modal, message, Form, Input, Button as AntButton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import SimpleCrudForm from './forms/SimpleCrudForm';
import { useDebounce } from '../../../hooks/useDebounce';
import ActionButton from './ActionButton';

const { useModal } = Modal;

const PositionsTab = () => {
    const { items: positions, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('positions');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [modal, contextHolder] = useModal();

    useEffect(() => { fetchData({ search: debouncedSearch || undefined }); }, [fetchData, debouncedSearch]);
    
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
        } catch (error) { message.error('Əməliyyat uğursuz oldu.', error); }
    };
    
    const columns = useMemo(() => [
        { title: 'Vəzifə Adı', dataIndex: 'name', key: 'name' },
        {
            title: 'Əməliyyatlar', key: 'action', width: 120,
            render: (_, record) => (
                <Space size={4}>
                    <ActionButton
                        tooltip="Redaktə et"
                        icon={<EditOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => { setEditingItem(record); form.setFieldsValue(record); setIsModalOpen(true); }}
                        colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    />
                    <ActionButton
                        tooltip="Sil"
                        icon={<DeleteOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => {
                            modal.confirm({
                                title: 'Əminsinizmi?',
                                content: `${record.name} adlı vəzifəni silmək istəyirsiniz?`,
                                okText: 'Bəli', cancelText: 'Xeyr', okType: 'danger',
                                onOk: async () => {
                                    try {
                                        await deleteItem(record.id);
                                        message.success('Vəzifə silindi.');
                                    } catch {
                                        message.error('Vəzifəni silmək mümkün olmadı.');
                                    }
                                }
                            });
                        }}
                        colorClass="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                    />
                </Space>
            ),
        },
    ], [form, deleteItem, modal]);

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                <Input.Search placeholder="Ada görə axtar..." onSearch={setSearch} allowClear className="flex-1 min-w-[200px]" />
                <AntButton type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>Yeni Vəzifə</AntButton>
            </div>
            <Table columns={columns} dataSource={positions} rowKey="id" loading={loading} />
            <Modal title={editingItem ? 'Vəzifəni Redaktə Et' : 'Yeni Vəzifə Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={(_, { OkBtn, CancelBtn }) => <><CancelBtn /><AntButton type="primary" onClick={handleOk}>Yadda Saxla</AntButton></>}>
                <SimpleCrudForm form={form} onFinish={onFinish} initialValues={editingItem} itemName="Vəzifə" />
            </Modal>
            {contextHolder}
        </div>
    );
};

export default PositionsTab;