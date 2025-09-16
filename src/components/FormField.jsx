import React from 'react';
import { Input, Select, DatePicker } from 'antd';

const FormField = ({ fieldConfig, isDark, ...props }) => {
  const commonProps = {
    className: isDark ? `antd-dark-${fieldConfig.type || 'input'}` : '',
    placeholder: fieldConfig.placeholder || ''
  };

  switch (fieldConfig.type) {
    case 'textarea':
      return <Input.TextArea rows={3} {...commonProps} {...props} />;
    
    case 'select':
      return (
        <Select 
            {...commonProps} 
            {...props} 
            options={fieldConfig.options}
            loading={fieldConfig.loading}
            dropdownClassName={isDark ? 'antd-dark-select-dropdown' : ''}
        />
      );

    case 'datepicker':
      return <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} {...commonProps} {...props} />;

    case 'number':
        return <Input type="number" {...commonProps} {...props} />;

    default: 
      return <Input {...commonProps} {...props} />;
  }
};

export default FormField;