import { useState, useEffect, useMemo } from 'react';
import { Table, Space, Modal, message, Form, Input, Button as AntButton, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import { useDebounce } from '../../../hooks/useDebounce';
import ActionButton from './ActionButton';
import EquipmentForm from './forms/EquipmentForm';

const { useModal } = Modal;

const EquipmentsTab = () => {
    const { items, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('equipments');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [modal, contextHolder] = useModal();

    useEffect(() => { 
        fetchData({ search: debouncedSearch || undefined }); 
    }, [fetchData, debouncedSearch]);
    
    const handleCancel = () => { 
        setIsModalOpen(false); 
        setEditingItem(null); 
        form.resetFields(); 
    };

    const onFinish = async (values) => {
        try {
            if (editingItem) {
                await updateItem(editingItem.id, values);
                message.success('Avadanlıq uğurla yeniləndi!');
            } else {
                await createItem(values);
                message.success('Avadanlıq uğurla yaradıldı!');
            }
            handleCancel();
        } catch (error) { 
            message.error('Əməliyyat uğursuz oldu.'); 
        }
    };
    
    const columns = useMemo(() => [
        { 
            title: 'Avadanlıq Adı', 
            dataIndex: 'name', 
            key: 'name',
            render: (text) => <span className="font-medium text-gray-700 dark:text-gray-200">{text}</span>
        },
        { 
            title: 'Növü', 
            dataIndex: 'equipment_type', 
            key: 'equipment_type',
            render: (type) => (
                <Tag color={type === 'bidon' ? 'blue' : 'green'}>
                    {type === 'bidon' ? 'BİDON' : 'DOLUM'}
                </Tag>
            )
        },
        {
            title: 'Əməliyyatlar', 
            key: 'action', 
            width: 120,
            render: (_, record) => (
                <Space size={4}>
                    <ActionButton
                        tooltip="Redaktə et"
                        icon={<EditOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => { 
                            setEditingItem(record); 
                            form.setFieldsValue(record); 
                            setIsModalOpen(true); 
                        }}
                        colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    />
                    <ActionButton
                        tooltip="Sil"
                        icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => {
                            modal.confirm({
                                title: 'Diqqət!',
                                content: `${record.name} avadanlığını silmək istəyirsiniz? Buna bağlı litrajlar da silinəcək.`,
                                okText: 'Bəli', cancelText: 'Xeyr', okType: 'danger',
                                onOk: async () => {
                                    try {
                                        await deleteItem(record.id);
                                        message.success('Avadanlıq silindi.');
                                    } catch {
                                        message.error('Silmək mümkün olmadı.');
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
                <Input.Search placeholder="Avadanlıq axtar..." onSearch={setSearch} allowClear className="flex-1 min-w-[200px]" />
                <AntButton type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalOpen(true); }}>
                    Yeni Avadanlıq
                </AntButton>
            </div>
            <Table columns={columns} dataSource={items} rowKey="id" loading={loading} />
            <Modal 
                title={editingItem ? 'Avadanlığı Redaktə Et' : 'Yeni Avadanlıq'} 
                open={isModalOpen} 
                onOk={() => form.submit()} 
                onCancel={handleCancel}
                destroyOnClose
            >
                <EquipmentForm form={form} onFinish={onFinish} initialValues={editingItem} />
            </Modal>
            {contextHolder}
        </div>
    );
};

export default EquipmentsTab;