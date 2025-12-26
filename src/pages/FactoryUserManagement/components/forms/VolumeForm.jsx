import { useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import accountsApi from '../../../../api/accountsApi';

const VolumeForm = ({ form, onFinish, initialValues }) => {
    const [equipments, setEquipments] = useState([]);

    useEffect(() => {
        accountsApi.getEquipments().then(res => setEquipments(res.data.results || res.data));
    }, []);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item name="equipment" label="Avadanlıq" rules={[{ required: true }]}>
                <Select showSearch optionFilterProp="children" placeholder="Avadanlıq seçin">
                    {equipments.map(e => (
                        <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            
            <Form.Item name="volume" label="Litraj" rules={[{ required: true }]}>
                <Input placeholder="Məs: 1.5 və ya 200" />
            </Form.Item>
        </Form>
    );
};

export default VolumeForm;