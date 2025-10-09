import { DatePicker, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { formatForDatePicker } from '../../../utils/dateFormatter';

const { Option } = Select;

const PerformanceFilters = ({
    user,
    selectedMonth,
    onMonthChange,
    departments,
    onDepartmentChange
}) => {
    return (
        <Row gutter={[16, 16]} className="mb-6 bg-white p-4 rounded-lg shadow">
            <Col xs={24} sm={12} md={8}>
                <DatePicker
                    value={dayjs(selectedMonth)}
                    onChange={(date) => onMonthChange(date ? date.toDate() : new Date())}
                    picker="month"
                    style={{ width: '100%' }}
                    format={formatForDatePicker}
                    allowClear={false}
                />
            </Col>
            {user && user.role === 'admin' && (
                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Departament seçin"
                        onChange={onDepartmentChange}
                        style={{ width: '100%' }}
                        allowClear
                    >
                        {departments.map(dep => (
                            <Option key={dep.id} value={dep.id}>{dep.name}</Option>
                        ))}
                    </Select>
                </Col>
            )}
        </Row>
    );
};

export default PerformanceFilters;