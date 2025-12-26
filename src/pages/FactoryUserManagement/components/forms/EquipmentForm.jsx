import { Form, Input, Select } from 'antd';

const EquipmentForm = ({ form, onFinish, initialValues }) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item name="name" label="Avadanlıq Adı" rules={[{ required: true }]}>
                <Input placeholder="Məs: 1600099A71" />
            </Form.Item>
            
            <Form.Item name="equipment_type" label="Seçim Növü" rules={[{ required: true }]}>
                <Select placeholder="Növü seçin">
                    <Select.Option value="bidon">Bidon</Select.Option>
                    <Select.Option value="dolum">Dolum</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default EquipmentForm;