import { useState, useEffect, useMemo } from 'react';
import { Table, Space, Modal, message, Form, Input, Select, Avatar, Button as AntButton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import UserForm from './forms/UserForm';
import { useDebounce } from '../../../hooks/useDebounce';
import accountsApi from '../../../api/accountsApi';
import ActionButton from './ActionButton';

const { useModal } = Modal;

const UsersTab = () => {
    const { items: users, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [modal, contextHolder] = useModal();
    const [filters, setFilters] = useState({ search: '', role: null, position: null });
    const debouncedSearch = useDebounce(filters.search, 500);

    const [positions, setPositions] = useState([]);
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const posRes = await accountsApi.getPositions();
                setPositions(posRes.data.results || posRes.data || []);
            } catch { message.error("Vəzifələri yükləmək mümkün olmadı."); }
        };
        fetchPositions();
    }, []);

    useEffect(() => {
        const params = {
            search: debouncedSearch || undefined,
            role: filters.role || undefined,
            position: filters.position || undefined,
        };
        fetchData(params);
    }, [fetchData, debouncedSearch, filters.role, filters.position]);

    const handleOk = () => form.submit();
    const handleCancel = () => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); };

    const onFinish = async (values) => {
        const formData = new FormData();
        for (const key in values) {
            const value = values[key];
            if (key === 'profile_photo') {
                if (value && value[0] && value[0].originFileObj) {
                    formData.append(key, value[0].originFileObj);
                } else if (!value || value.length === 0) {
                    formData.append(key, '');
                }
            } else if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => formData.append(key, v));
                } else {
                    formData.append(key, value);
                }
            }
        }
        
        try {
            if (editingItem) {
                await updateItem(editingItem.id, formData);
                message.success('İstifadəçi uğurla yeniləndi!');
            } else {
                await createItem(formData);
                message.success('İstifadəçi uğurla yaradıldı!');
            }
            handleCancel();
        } catch (error) {
            const errorData = error.response?.data;
            let errorMsg = 'Əməliyyat uğursuz oldu.';
            if (errorData) {
                errorMsg = Object.values(errorData).flat().join(' \n');
            }
            message.error(errorMsg);
        }
    };
    

    const columns = useMemo(() => [
        { 
            title: 'Ad Soyad', dataIndex: 'first_name', 
            render: (_, r) => <Space><Avatar src={r.profile_photo?.[0]?.url || r.profile_photo} icon={<UserOutlined />} /><span>{`${r.first_name || ''} ${r.last_name || ''}`}</span></Space>, 
            fixed: 'left', width: 200, className: 'dark:bg-[#1B232D]',
        },
        { title: 'Email', dataIndex: 'email', width: 200 },
        { title: 'Vəzifə', dataIndex: 'position_details', render: (pos) => pos?.name || '-', width: 150 },
        { title: 'Rol', dataIndex: 'role_display', width: 150 },
        { title: 'Departament(lər)', dataIndex: 'all_departments', render: (depts) => depts?.join(', ') || '-', width: 200 },
        {
            title: 'Əməliyyatlar', key: 'action', width: 120, fixed: 'right', className: 'dark:bg-[#1B232D]',
            render: (_, record) => (
                <Space size={4}>
                    <ActionButton
                        tooltip="Redaktə et"
                        icon={<EditOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => {
                            const initialData = { ...record, position: record.position_details?.id, department: record.department, profile_photo: record.profile_photo ? [{ uid: '-1', name: 'sekil.png', status: 'done', url: record.profile_photo }] : [] };
                            setEditingItem(initialData); 
                            form.setFieldsValue(initialData); 
                            setIsModalOpen(true);
                        }}
                        colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    />
                    <ActionButton
                        tooltip="Sil"
                        icon={<DeleteOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => {
                            modal.confirm({
                                title: 'Əminsinizmi?',
                                content: `İstifadəçini silmək istəyirsiniz?`,
                                okText: 'Bəli', cancelText: 'Xeyr', okType: 'danger',
                                onOk: async () => {
                                    try {
                                        await deleteItem(record.id);
                                        message.success('İstifadəçi silindi.');
                                    } catch {
                                        message.error('İstifadəçini silmək mümkün olmadı.');
                                    }
                                },
                            });
                        }}
                        colorClass="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                    />
                </Space>
            ),
        },
    ], [form, deleteItem, modal]);

    const ROLE_CHOICES = [ 
            { value: "admin", label: "Admin" }, 
            { value: "ceo", label: "CEO" }, 
            { value: "top_management", label: "Yuxarı İdarəetmə" }, 
            { value: "department_lead", label: "Departament Rəhbəri" }, 
            { value: "manager", label: "Menecer" }, 
            { value: "employee", label: "İşçi" }
        ];
    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                <Input.Search placeholder="Ad, soyad, email ilə axtar..." onSearch={value => setFilters(f => ({ ...f, search: value }))} allowClear className="flex-1 min-w-[200px]" />
                <Select placeholder="Rola görə filterlə" onChange={value => setFilters(f => ({ ...f, role: value }))} allowClear options={ROLE_CHOICES} className="flex-1 min-w-[200px]" />
                <Select placeholder="Vəzifəyə görə filterlə" onChange={value => setFilters(f => ({ ...f, position: value }))} allowClear options={positions.map(p => ({label: p.name, value: p.id}))} className="flex-1 min-w-[200px]" />
                <AntButton type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>Yeni İstifadəçi</AntButton>
            </div>
            <Table columns={columns} dataSource={users} rowKey="id" loading={loading} scroll={{ x: 1200 }} />
            <Modal title={editingItem ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={800} footer={(_, { OkBtn, CancelBtn }) => <><CancelBtn /><AntButton type="primary" onClick={handleOk}>Yadda Saxla</AntButton></>}>
                <UserForm form={form} onFinish={onFinish} isEdit={!!editingItem} initialValues={editingItem} />
            </Modal>
            {contextHolder}
        </div>
    );
};

export default UsersTab;