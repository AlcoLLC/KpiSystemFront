import { useState, useEffect, useMemo } from 'react';
import { Table, Space, Modal, message, Form, Input, Select, Avatar, Button as AntButton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import FactoryUserForm from './forms/FactoryUserForm';
import accountsApi from '../../../api/accountsApi';
import ActionButton from './ActionButton';
import { useDebounce } from '../../../hooks/useDebounce';

const { useModal } = Modal;

const FactoryUsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [modal, contextHolder] = useModal();
    
    const [filters, setFilters] = useState({ search: '', type: null, role: null });
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const res = await accountsApi.getFactoryUsers(params);
            setUsers(res.data.results || res.data || []);
        } catch { 
            message.error("Məlumatlar yüklənmədi."); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        const params = {
            search: debouncedSearch || undefined,
            factory_type: filters.type || undefined,
            factory_role: filters.role || undefined,
        };
        fetchData(params);
    }, [debouncedSearch, filters.type, filters.role]);

    const handleOk = () => form.submit();
    const handleCancel = () => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); };

    const onFinish = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'profile_photo') {
                if (values[key] && values[key][0] && values[key][0].originFileObj) {
                    formData.append(key, values[key][0].originFileObj);
                } else if (!values[key] || values[key].length === 0) {
                    formData.append(key, '');
                }
            } else if (values[key] !== undefined && values[key] !== null) {
                formData.append(key, values[key]);
            }
        });

        try {
            if (editingItem) {
                await accountsApi.updateFactoryUser(editingItem.id, formData);
                message.success("Məlumat yeniləndi!");
            } else {
                await accountsApi.createFactoryUser(formData);
                message.success("Yeni işçi əlavə edildi!");
            }
            handleCancel();
            fetchData();
        } catch (error) { 
            message.error("Xəta baş verdi."); 
        }
    };

    const columns = useMemo(() => [
        { 
            title: 'İşçi', 
            dataIndex: 'first_name',
            fixed: 'left',
            width: 200,
            className: 'dark:bg-[#1B232D]',
            render: (_, r) => (
                <Space>
                    <Avatar src={r.profile_photo} icon={<UserOutlined />} />
                    <span className="font-medium">{`${r.first_name} ${r.last_name}`}</span>
                </Space>
            ) 
        },
        { title: 'Email', dataIndex: 'email', width: 200 },
        { 
            title: 'Zavod', 
            dataIndex: 'factory_type_display', 
            width: 120,
            render: (v) => <span className="uppercase text-xs font-bold px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">{v}</span> 
        },
        { title: 'Rol', dataIndex: 'factory_role_display', width: 150 },
        { title: 'Vəzifə', dataIndex: 'position_details', render: (pos) => pos?.name || '-', width: 150 },
        {
            title: 'Əməliyyatlar',
            key: 'action',
            width: 120,
            fixed: 'right',
            className: 'dark:bg-[#1B232D]',
            render: (_, record) => (
                <Space size={4}>
                    <ActionButton 
                        tooltip="Redaktə et"
                        icon={<EditOutlined style={{ fontSize: '20px' }} />} 
                        onClick={() => { 
                            const editData = {
                                ...record,
                                factory_position: record.position_details?.id,
                                profile_photo: record.profile_photo ? [{ uid: '-1', status: 'done', url: record.profile_photo }] : []
                            };
                            setEditingItem(record); 
                            form.setFieldsValue(editData); 
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
                                content: `${record.first_name} ${record.last_name} adlı işçini silmək istəyirsiniz?`,
                                okText: 'Bəli', cancelText: 'Xeyr', okType: 'danger',
                                onOk: async () => {
                                    try {
                                        await accountsApi.deleteFactoryUser(record.id);
                                        message.success('Silindi.');
                                        fetchData();
                                    } catch { message.error('Xəta baş verdi.'); }
                                },
                            });
                        }} 
                        colorClass="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50" 
                    />
                </Space>
            )
        }
    ], [form, modal]);

    const FACTORY_TYPES = [{ value: "dolum", label: "Dolum" }, { value: "bidon", label: "Bidon" }];
    const FACTORY_ROLES = [
        { value: "top_management", label: "Zavod Direktoru" },
        { value: "deputy_director", label: "Zavod Direktoru Müavini" },
        { value: "department_lead", label: "Bölmə Rəhbəri" },
        { value: "employee", label: "İşçi" },
    ];

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                <Input.Search 
                    placeholder="Ad, soyad və ya email ilə axtar..." 
                    onSearch={value => setFilters(f => ({ ...f, search: value }))} 
                    allowClear 
                    className="flex-1 min-w-[200px]" 
                />
                <Select 
                    placeholder="Zavod seç" 
                    onChange={value => setFilters(f => ({ ...f, type: value }))} 
                    allowClear 
                    options={FACTORY_TYPES} 
                    className="flex-1 min-w-[150px]" 
                />
                <Select 
                    placeholder="Rola görə filterlə" 
                    onChange={value => setFilters(f => ({ ...f, role: value }))} 
                    allowClear 
                    options={FACTORY_ROLES} 
                    className="flex-1 min-w-[150px]" 
                />
                <AntButton 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}
                >
                    Yeni İstifadəçi
                </AntButton>
            </div>

            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="id" 
                loading={loading} 
                scroll={{ x: 1000 }} 
            />

            <Modal 
                title={editingItem ? "İşçini Redaktə Et" : "Yeni istifadəçi"} 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel} 
                width={800}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <AntButton type="primary" onClick={handleOk}>Yadda Saxla</AntButton>
                    </>
                )}
            >
                <FactoryUserForm form={form} onFinish={onFinish} isEdit={!!editingItem} />
            </Modal>
            {contextHolder}
        </div>
    );
};

export default FactoryUsersTab;