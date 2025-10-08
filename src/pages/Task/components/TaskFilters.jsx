// TaskFilters.jsx (Yenilənmiş versiya)

import React from 'react';
import { Row, Col, Select, DatePicker, Card } from 'antd';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../../features/tasks/utils/taskUtils.jsx';

const { RangePicker } = DatePicker;

const TaskFilters = React.memo(({ 
    filters, 
    onFilterChange, 
    users, 
    departments, // <--- YENİ: Departamentlər siyahısı üçün prop
    currentUserRole // <--- YENİ: Giriş etmiş istifadəçinin rolu üçün prop
}) => {
    // Yalnız admin və top_management üçün departament filterini göstər
    const showDepartmentFilter = ['admin', 'top_management'].includes(currentUserRole);

    return (
        <Card size="small" className="mb-4 bg-gray-50 dark:bg-[#2A3441]" bodyStyle={{ padding: '16px' }}>
            <Row gutter={[16, 16]}>
                {/* Status və Prioritet filterləri olduğu kimi qalır */}
                <Col xs={24} sm={12} md={6}>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                    <Select placeholder="Status seçin" allowClear style={{ width: '100%' }} value={filters.status} onChange={v => onFilterChange('status', v)} options={STATUS_OPTIONS} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Prioritet</label>
                    <Select placeholder="Prioritet seçin" allowClear style={{ width: '100%' }} value={filters.priority} onChange={v => onFilterChange('priority', v)} options={PRIORITY_OPTIONS} />
                </Col>
                
                {/* --- YENİ DEPARTAMENT FİLTERİ --- */}
                {showDepartmentFilter && (
                    <Col xs={24} sm={12} md={6}>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Departament</label>
                        <Select
                            placeholder="Departament seçin"
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                            value={filters.department}
                            onChange={v => onFilterChange('department', v)}
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                            // `departments` prop-undan gələn məlumatları istifadə edirik
                            options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                        />
                    </Col>
                )}

                {/* İcraçı filteri (əvvəlki `permissions` prop-u ilə qala bilər və ya `currentUserRole` ilə idarə oluna bilər) */}
                <Col xs={24} sm={12} md={6}>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">İcraçı</label>
                    <Select
                        placeholder="İcraçı seçin"
                        allowClear
                        showSearch
                        style={{ width: '100%' }}
                        value={filters.assignee}
                        onChange={v => onFilterChange('assignee', v)}
                        filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        options={users.map(user => ({ value: user.id, label: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username }))}
                    />
                </Col>

                {/* Tarix aralığı olduğu kimi qalır */}
                <Col xs={24} sm={12} md={6}>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tarix aralığı</label>
                    <RangePicker style={{ width: '100%' }} placeholder={['Başlama', 'Bitmə']} format="DD.MM.YYYY" value={filters.date_range} onChange={dates => onFilterChange('date_range', dates)} />
                </Col>
            </Row>
        </Card>
    );
});

export default TaskFilters;