import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Space, Modal, message, Form, Input, Select, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useManagementData } from '../hooks/useManagementData';
import UserForm from './forms/UserForm';
import { useDebounce } from '../../../hooks/useDebounce';
import accountsApi from '../../../api/accountsApi';

const UsersTab = () => {
    const { items: users, loading, fetchData, createItem, updateItem, deleteItem } = useManagementData('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    
    const [filters, setFilters] = useState({ search: '', role: null, position: null });
    const debouncedSearch = useDebounce(filters.search, 500);

    const [positions, setPositions] = useState([]);
    useEffect(() => {
        const fetchPositions = async () => {
            const posRes = await accountsApi.getPositions();
            setPositions(posRes.data.results || posRes.data || []);
        };
        fetchPositions();
    }, []);

    useEffect(() => {
        fetchData({ search: debouncedSearch, role: filters.role, position: filters.position });
    }, [fetchData, debouncedSearch, filters.role, filters.position]);

    const handleOk = () => form.submit();
    const handleCancel = () => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); };

    const onFinish = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'profile_photo') {
                if (values.profile_photo?.[0]?.originFileObj) {
                    formData.append(key, values.profile_photo[0].originFileObj);
                }
            } else if (values[key] !== undefined && values[key] !== null) {
                if (Array.isArray(values[key])) { // For multiple select
                    values[key].forEach(val => formData.append(key, val));
                } else {
                    formData.append(key, values[key]);
                }
            }
        });
        
        try {
            if (editingItem) {
                await updateItem(editingItem.id, formData);
                message.success('İstifadəçi uğurla yeniləndi!');
            } else {
                await createItem(formData);
                message.success('İstifadəçi uğurla yaradıldı!');
            }
            handleCancel();
        } catch (error) { message.error('Əməliyyat uğursuz oldu.'); }
    };
    
    const columns = useMemo(() => [
        { title: 'Ad Soyad', dataIndex: 'first_name', render: (_, r) => <Space><Avatar src={r.profile_photo} icon={<UserOutlined />} /><span>{`${r.first_name || ''} ${r.last_name || ''}`}</span></Space> },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Vəzifə', dataIndex: 'position_details', render: (pos) => pos?.name },
        { title: 'Rol', dataIndex: 'role_display' },
        { title: 'Departament(lər)', dataIndex: 'all_departments', render: (depts) => depts?.join(', ') },
        {
            title: 'Əməliyyatlar', key: 'action', width: 120,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => {
                         const initialData = { ...record, position: record.position_details?.id, department: record.department };
                         setEditingItem(initialData); form.setFieldsValue(initialData); setIsModalOpen(true);
                    }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => {
                        Modal.confirm({
                            title: 'Əminsinizmi?', content: `İstifadəçini silmək istəyirsiniz?`, okText: 'Bəli', cancelText: 'Xeyr',
                            onOk: async () => {
                                try { await deleteItem(record.id); message.success('İstifadəçi silindi.'); }
                                catch { message.error('İstifadəçini silmək mümkün olmadı.'); }
                            }
                        });
                    }} />
                </Space>
            ),
        },
    ], [form]);

    const ROLE_CHOICES = [ { value: "top_management", label: "Yuxarı İdarəetmə" }, { value: "department_lead", label: "Departament Rəhbəri" }, { value: "manager", label: "Menecer" }, { value: "employee", label: "İşçi" }];

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
                 <Input.Search placeholder="Ad, soyad, email ilə axtar..." onChange={e => setFilters(f => ({ ...f, search: e.target.value}))} allowClear style={{ flex: 1, minWidth: '200px' }} />
                 <Select placeholder="Rola görə filterlə" onChange={value => setFilters(f => ({ ...f, role: value }))} allowClear options={ROLE_CHOICES} style={{ flex: 1, minWidth: '200px' }} />
                 <Select placeholder="Vəzifəyə görə filterlə" onChange={value => setFilters(f => ({ ...f, position: value }))} allowClear options={positions.map(p => ({label: p.name, value: p.id}))} style={{ flex: 1, minWidth: '200px' }} />
                 <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Yeni İstifadəçi</Button>
            </div>
            <Table columns={columns} dataSource={users} rowKey="id" loading={loading} scroll={{ x: true }} />
            <Modal title={editingItem ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi Yarat'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={800} footer={(_, { OkBtn, CancelBtn }) => <><CancelBtn /><OkBtn /></>}>
                <UserForm form={form} onFinish={onFinish} isEdit={!!editingItem} />
            </Modal>
        </div>
    );
};

export default UsersTab;