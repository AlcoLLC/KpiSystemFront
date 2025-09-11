import React from 'react';
import { Input, Select, DatePicker } from 'antd';

const { Option } = Select;

const FormField = ({ fieldConfig, isDark }) => {
  const commonProps = {
    className: isDark ? `antd-dark-${fieldConfig.type || 'input'}` : '',
    placeholder: fieldConfig.placeholder || ''
  };

  switch (fieldConfig.type) {
    case 'textarea':
      return <Input.TextArea rows={3} {...commonProps} />;
    case 'select':
      return (
        <Select {...commonProps} dropdownClassName={isDark ? 'antd-dark-select-dropdown' : ''}>
          {fieldConfig.options?.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      );
    case 'datepicker':
      return <DatePicker format="DD MMM, YYYY" style={{ width: '100%' }} {...commonProps} />;
    case 'number':
        return <Input type="number" {...commonProps} />;
    default: 
      return <Input {...commonProps} />;
  }
};

export default FormField;