import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, message, Space, Tag, Select, DatePicker, Modal } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReusableTable from '../../components/ReusableTable';
import productionApi from '../../api/productionApi';
import ProductionFormModal from './components/ProductionFormModal';
import dayjs from 'dayjs';
import '../../styles/production.css';

const { RangePicker } = DatePicker;

const { useModal } = Modal;

const Production = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modal, contextHolder] = useModal();
    
    const [equipments, setEquipments] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (typeFilter) params.type = typeFilter;
            if (dateRange) {
                params.start_date = dateRange[0].format('YYYY-MM-DD');
                params.end_date = dateRange[1].format('YYYY-MM-DD');
            }

            const [prodRes, eqRes, empRes] = await Promise.all([
                productionApi.getProductions(params),
                productionApi.getEquipments(),
                productionApi.getFactoryEmployees()
            ]);
            setData(prodRes.data.results || prodRes.data);
            setEquipments(eqRes.data.results || eqRes.data);
            setEmployees(empRes.data.results || empRes.data);
        } catch (error) {
            message.error("Məlumatlar yüklənərkən xəta baş verdi");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, typeFilter, dateRange]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAction = (record, mode, e) => {
        if (e) e.stopPropagation();
        setModalMode(mode);
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

const handleDelete = (id, e) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (!id) {
        message.error("ID tapılmadı");
        return;
    }

    modal.confirm({
            title: 'Silmək istədiyinizə əminsiniz?',
            content: 'Bu məlumat daimi olaraq silinəcək.',
            okText: 'Bəli',
            okType: 'danger',
            cancelText: 'Xeyr',
            centered: true,
            onOk: async () => {
                try {
                    await productionApi.deleteProduction(id);
                    message.success("Məlumat uğurla silindi");
                    await fetchData();
                } catch (error) {
                    console.error("Silmə xətası:", error);
                    message.error("Məlumat silinərkən xəta baş verdi.");
                }
            },
        });
    };

    const columns = [
        { title: '№', key: 'index', width: 60, render: (_, __, i) => i + 1 },
        { title: 'Tarix', dataIndex: 'date', key: 'date', render: d => dayjs(d).format('DD.MM.YYYY') },
        { title: 'Avadanlıq', dataIndex: 'equipment_obj', key: 'equipment' },
        { title: 'Smen', dataIndex: 'shift', key: 'shift', render: s => <Tag color="blue">{s}-ci smen</Tag> },
        { 
            title: 'Yekun Səmərəlilik', 
            dataIndex: 'final_efficiency', 
            key: 'final_efficiency',
            render: val => <Tag color={val >= 90 ? 'green' : val >= 50 ? 'orange' : 'red'}>{val}%</Tag>
        },
        {
            title: 'İşçilər',
            dataIndex: 'employees_obj',
            key: 'employees',
            render: (emps) => emps?.map(e => e.full_name).join(', ')
        },
        {
            title: 'Əməliyyatlar',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined 
                        className="text-blue-500 cursor-pointer text-lg" 
                        onClick={(e) => handleAction(record, 'edit', e)} 
                    />
                    <DeleteOutlined 
                        className="text-red-500 cursor-pointer text-lg" 
                        onClick={(e) => handleDelete(record.id, e)}
                    />
                </Space>
            )
        }
    ];

    return (
        <div className="p-4 dark-production-page">
            {contextHolder}
            <h2 className="text-xl font-medium mb-6 dark:text-white">İstehsal Hesabatları</h2>
            
            <div className="flex flex-wrap gap-4 mb-6 bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-sm">
                <Input 
                    placeholder="Avadanlıq axtar..." 
                    prefix={<SearchOutlined />} 
                    style={{ width: 250 }}
                    allowClear
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Select 
                    placeholder="Sex seçin" 
                    allowClear 
                    style={{ width: 150 }}
                    onChange={setTypeFilter}
                    options={[{value:'bidon', label:'Bidon'}, {value:'dolum', label:'Dolum'}]}
                />
                <RangePicker 
                    format="DD.MM.YYYY"
                    onChange={setDateRange}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAction(null, 'add')}>
                    Yeni Hesabat
                </Button>
            </div>

            {/* Vizual problemi rowClassName və xüsusi CSS selectorları ilə həll edirik */}
            <ReusableTable 
                columns={columns} 
                dataSource={data} 
                loading={loading} 
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleAction(record, 'view')
                })}
                // Satırların hover effektini tünd mövzuya uyğunlaşdırmaq üçün
                rowClassName={() => 'custom-table-row cursor-pointer dark:hover:bg-gray-800'}
            />

            <ProductionFormModal 
                open={isModalOpen}
                mode={modalMode}
                initialData={selectedRecord}
                onCancel={() => setIsModalOpen(false)}
                onFinish={() => { setIsModalOpen(false); fetchData(); }}
                equipments={equipments}
                employees={employees}
            />

            
        </div>
    );
};

export default Production;