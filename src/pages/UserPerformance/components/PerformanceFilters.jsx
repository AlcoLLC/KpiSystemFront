import { DatePicker, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';
// Azərbaycan dilində ay adlarını göstərmək üçün lokalizasiya
import 'dayjs/locale/az';

// dayjs üçün Azərbaycan lokalını aktivləşdiririk
dayjs.locale('az');

const { Option } = Select;

const PerformanceFilters = ({
  // Mövcud props-lar
  user,
  selectedMonth,
  onMonthChange,
  departments,
  onDepartmentChange,
  // Yeni əlavə olunan props-lar
  canEvaluate,
  activeTab,
  evaluationStatus,
  onEvaluationStatusChange,
}) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <Row gutter={[16, 16]} align="bottom">
        {/* --- Ay seçimi (dəyişiklik yoxdur) --- */}
        <Col xs={24} sm={12} md={8}>
          <label className="font-semibold block mb-2">Ay seçin</label>
          <DatePicker
            value={dayjs(selectedMonth)}
            onChange={(date) => onMonthChange(date ? date.toDate() : new Date())}
            picker="month"
            style={{ width: '100%' }}
            format="MMMM YYYY" // Format birbaşa təyin edildi
            allowClear={false}
          />
        </Col>

        {/* --- Departament seçimi (yalnız admin üçün) --- */}
        {user && user.role === 'admin' && (
          <Col xs={24} sm={12} md={8}>
            <label className="font-semibold block mb-2">Departament</label>
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
        
        {/* --- YENİ: Qiymətləndirmə Statusu filtri --- */}
        {/* Bu blok yalnız rəhbər səlahiyyəti olduqda VƏ "Komandam" vərəqi aktiv olduqda görünür */}
        {canEvaluate && activeTab === 'team' && (
          <Col xs={24} sm={12} md={8}>
            <label className="font-semibold block mb-2">Qiymətləndirmə Statusu</label>
            <Select
              value={evaluationStatus}
              onChange={onEvaluationStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="all">Hamısı</Option>
              <Option value="evaluated">Qiymətləndirilənlər</Option>
              <Option value="pending">Qiymətləndirilməyənlər</Option>
            </Select>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default PerformanceFilters;