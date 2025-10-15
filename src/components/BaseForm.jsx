import { Form } from 'antd';

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