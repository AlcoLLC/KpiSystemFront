import { Input, Select, DatePicker } from 'antd';

const FormField = ({ fieldConfig, isDark, ...props }) => {
  const customProps = fieldConfig.props || {};

  const commonProps = {
    className: isDark ? `antd-dark-${fieldConfig.type || 'input'}` : '',
    placeholder: fieldConfig.placeholder || '',
    ...customProps, 
    ...props,
  };

  switch (fieldConfig.type) {
    case 'textarea':
      return <Input.TextArea rows={3} {...commonProps} />;
    
    case 'select':
      return (
        <Select 
            {...commonProps} 
            options={fieldConfig.options}
            loading={fieldConfig.loading}
            dropdownClassName={isDark ? 'antd-dark-select-dropdown' : ''}
        />
      );

    case 'datepicker':
      return <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} {...commonProps} />;

    case 'number':
        return <Input type="number" {...commonProps} />;

    default: 
      return <Input {...commonProps} />;
  }
};

export default FormField;