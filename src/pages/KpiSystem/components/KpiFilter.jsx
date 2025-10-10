import { Flex, Select, Space, Typography } from "antd"; 
import { FilterOutlined } from "@ant-design/icons";

const KpiFilter = ({ selectedFilter, onChange, options }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
        <Flex align="center" justify="space-between">
            <Space align="baseline">
                <FilterOutlined style={{ color: '#4b5563', fontSize: '18px' }} />
                <Typography.Text strong className="text-gray-600">
                    Tapşırıq Görünüşünü Filtrlə
                </Typography.Text>
            </Space>
            <Select
                size="large"
                style={{ width: 350 }}
                value={selectedFilter}
                onChange={onChange}
                getPopupContainer={triggerNode => triggerNode.parentNode}
            >
                {options.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                       <Space>{opt.icon}{opt.label}</Space>
                    </Select.Option>
                ))}
            </Select>
        </Flex>
    </div>
);

export default KpiFilter;