import { Form, Input } from 'antd';

const SimpleCrudForm = ({ form, onFinish, initialValues, itemName }) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item
                name="name"
                label={`${itemName} Adı`}
                rules={[{ required: true, message: `Zəhmət olmasa, ${itemName.toLowerCase()} adını daxil edin!` }]}
            >
                <Input placeholder={`${itemName} adını daxil edin`} />
            </Form.Item>
        </Form>
    );
};

export default SimpleCrudForm;