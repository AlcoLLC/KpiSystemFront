import { useSelector } from 'react-redux';
import { Form, Row, Col } from 'antd';  
import BaseForm from './BaseForm';
import FormField from './FormField';

function AppForm({ form, fields, onFinish }) {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <BaseForm form={form} onFinish={onFinish}>
       <Row gutter={[16, 0]}>  
        {fields.map(field => (
           <Col key={field.name} xs={24} md={field.span || 24}>
            <Form.Item
              name={field.name}
              label={<span style={{ color: isDark ? 'white' : 'black' }}>{field.label}</span>}
              rules={field.rules || []}
              initialValue={field.initialValue}
            >
              <FormField fieldConfig={field} isDark={isDark} />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </BaseForm>
  );
}

export default AppForm;