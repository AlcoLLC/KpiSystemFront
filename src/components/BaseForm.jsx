import React from 'react';
import { Form } from 'antd';

/**
 * 
 * @param {object} form 
 * @param {function} onFinish 
 * @param {React.ReactNode} children ).
 * @param {string} layout 
 */
function BaseForm({ form, onFinish, children, layout = 'vertical' }) {
  return (
    <Form
      form={form}
      layout={layout}
      onFinish={onFinish}
    >
      {children}
    </Form>
  );
}

export default BaseForm;