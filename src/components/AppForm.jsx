import React from 'react';
import { useSelector } from 'react-redux';
import { Form, Row, Col } from 'antd'; // Row və Col-u import edirik
import BaseForm from './BaseForm';
import FormField from './FormField';

function AppForm({ form, fields, onFinish }) {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <BaseForm form={form} onFinish={onFinish}>
      {/* Bütün sahələri Row içinə alırıq */}
      <Row gutter={[16, 0]}> {/* gutter - sütunlar arası məsafə */}
        {fields.map(field => (
          // Hər bir sahəni Col içinə alırıq
          // xs={24} -> kiçik ekranlarda (mobil) hamısı tam en olsun
          // md={field.span || 24} -> orta və böyük ekranlarda bizim təyin etdiyimiz eni götürsün
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