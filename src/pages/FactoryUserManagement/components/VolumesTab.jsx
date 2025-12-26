import { useState, useEffect, useMemo } from 'react';
import { Table, Space, Modal, message, Form, Input, Button as AntButton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import { useDebounce } from '../../../hooks/useDebounce';
import ActionButton from './ActionButton';
import VolumeForm from './forms/VolumeForm';

const { useModal } = Modal;

const VolumesTab = () => {
    const { items, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('volumes');
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
                message.success('Litraj yeniləndi!');
            } else {
                await createItem(values);
                message.success('Litraj əlavə edildi!');
            }
            handleCancel();
        } catch (error) { 
            message.error('Əməliyyat uğursuz oldu.'); 
        }
    };
    
    const columns = useMemo(() => [
        { 
            title: 'Avadanlıq', 
            dataIndex: ['equipment_details', 'name'],
            key: 'equipment',
            render: (text, record) => record.equipment_name || text || "Yüklənir..." 
        },
        { 
            title: 'Bidon Litrajı', 
            dataIndex: 'volume', 
            key: 'volume',
            render: (val) => <p>{val}</p>
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
                            form.setFieldsValue({
                                ...record,
                                equipment: record.equipment
                            }); 
                            setIsModalOpen(true); 
                        }}
                        colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    />
                    <ActionButton
                        tooltip="Sil"
                        icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => {
                            modal.confirm({
                                title: 'Silməyə əminsiniz?',
                                content: `${record.volume} litrajı siyahıdan silinəcək.`,
                                okText: 'Sil', cancelText: 'Ləğv et', okType: 'danger',
                                onOk: async () => {
                                    try {
                                        await deleteItem(record.id);
                                        message.success('Litraj silindi.');
                                    } catch {
                                        message.error('Xəta baş verdi.');
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
                <Input.Search placeholder="Litraj axtar..." onSearch={setSearch} allowClear className="flex-1 min-w-[200px]" />
                <AntButton type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalOpen(true); }}>
                    Yeni Litraj
                </AntButton>
            </div>
            <Table columns={columns} dataSource={items} rowKey="id" loading={loading} />
            <Modal 
                title={editingItem ? 'Litrajı Redaktə Et' : 'Yeni Litraj Əlavə Et'} 
                open={isModalOpen} 
                onOk={() => form.submit()} 
                onCancel={handleCancel}
                destroyOnClose
            >
                <VolumeForm form={form} onFinish={onFinish} initialValues={editingItem} />
            </Modal>
            {contextHolder}
        </div>
    );
};

export default VolumesTab;