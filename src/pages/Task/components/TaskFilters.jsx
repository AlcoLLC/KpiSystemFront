import React from 'react';
import { Row, Col, Select, DatePicker, Card } from 'antd';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/taskConstants';

const { RangePicker } = DatePicker;

const TaskFilters = React.memo(({ filters, onFilterChange, users, permissions}) => (
  <Card size="small" className="mb-4 bg-gray-50 dark:bg-[#2A3441]" bodyStyle={{ padding: '16px' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
        <Select placeholder="Status seçin" allowClear style={{ width: '100%' }} value={filters.status} onChange={v => onFilterChange('status', v)} options={STATUS_OPTIONS} />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Prioritet</label>
        <Select placeholder="Prioritet seçin" allowClear style={{ width: '100%' }} value={filters.priority} onChange={v => onFilterChange('priority', v)} options={PRIORITY_OPTIONS} />
      </Col>
      {permissions.showAssigneeFilter && (
      <Col xs={24} sm={12} md={6}>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">İcraçı</label>
        <Select placeholder="İcraçı seçin" allowClear showSearch style={{ width: '100%' }} value={filters.assignee}
          onChange={v => onFilterChange('assignee', v)}
          filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
          options={users.map(user => ({ value: user.id, label: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username }))} />
      </Col>
      )}
      <Col xs={24} sm={12} md={6}>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tarix aralığı</label>
        <RangePicker style={{ width: '100%' }} placeholder={['Başlama', 'Bitmə']} format="DD.MM.YYYY" value={filters.date_range} onChange={dates => onFilterChange('date_range', dates)} />
      </Col>
    </Row>
  </Card>
));

export default TaskFilters;