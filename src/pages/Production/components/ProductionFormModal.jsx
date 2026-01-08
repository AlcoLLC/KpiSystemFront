import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Divider, Row, Col, Typography, Input, Tag, message } from 'antd';
import productionApi from '../../../api/productionApi';
import dayjs from 'dayjs';

const { Text } = Typography;

const ProductionFormModal = ({ open, onCancel, onFinish, equipments, employees, mode, initialData }) => {
    const [form] = Form.useForm();
    const [selectedVolumes, setSelectedVolumes] = useState([]);
    const [calculatedEff, setCalculatedEff] = useState({});

    useEffect(() => {
        if (open) {
            if (mode !== 'add' && initialData) {
                const eq = equipments.find(e => e.id === initialData.equipment);
                setSelectedVolumes(eq?.volumes || []);
                
                const formattedItems = initialData.items.map(item => ({
                    volume: item.volume,
                    production_hours: item.production_hours,
                    actual_count: item.actual_count,
                    target_norm: item.target_norm
                }));

                form.setFieldsValue({
                    ...initialData,
                    date: dayjs(initialData.date),
                    items: formattedItems
                });

                const effs = {};
                initialData.items.forEach((item, idx) => {
                    effs[idx] = item.efficiency;
                });
                setCalculatedEff(effs);
            } else {
                form.resetFields();
                form.setFieldsValue({ date: dayjs() });
                setSelectedVolumes([]);
                setCalculatedEff({});
            }
        }
    }, [open, initialData, mode, equipments, form]);

    const handleEquipmentChange = (eqId) => {
        const eq = equipments.find(e => e.id === eqId);
        setSelectedVolumes(eq?.volumes || []);
        form.setFieldsValue({ items: [] });
    };

    const handleCalc = (index) => {
        const items = form.getFieldValue('items') || [];
        const item = items[index];
        const count = item?.actual_count || 0;
        const norm = item?.target_norm || 0;
        const res = norm > 0 ? ((count / norm) * 100).toFixed(2) : 0;
        setCalculatedEff(prev => ({ ...prev, [index]: res }));
    };

    const submit = async (values) => {
        if (mode === 'view') return onCancel();
        
        const payload = {
            ...values,
            date: values.date.format('YYYY-MM-DD'),
            items: values.items.map(item => ({
                volume: item.volume,
                production_hours: item.production_hours || 0,
                actual_count: item.actual_count || 0,
                target_norm: item.target_norm || 0
            }))
        };

        try {
            if (mode === 'edit') {
                await productionApi.updateProduction(initialData.id, payload);
                message.success("Yeniləndi");
            } else {
                await productionApi.createProduction(payload);
                message.success("Yaradıldı");
            }
            onFinish();
        } catch (e) { message.error("Xəta baş verdi"); }
    };

    return (
        <Modal
            title={mode === 'view' ? "Hesabat Təfərrüatı" : (mode === 'edit' ? "Redaktə" : "Yeni Hesabat")}
            open={open} 
            onCancel={onCancel} 
            onOk={() => form.submit()} 
            width={1000} 
            destroyOnClose
            okButtonProps={{ style: mode === 'view' ? { display: 'none' } : {} }}
        >
            <Form form={form} layout="vertical" onFinish={submit} disabled={mode === 'view'}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="date" label="Tarix">
                            <DatePicker className="w-full" format="DD.MM.YYYY" />
                        </Form.Item>
                    </Col>                
                    <Col span={8}>
                        <Form.Item name="shift" label="Smen">
                            <Select options={[{value:1, label:'1s'},{value:2, label:'2s'},{value:3, label:'3s'}]}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="equipment" label="Avadanlıq">
                            <Select 
                                onChange={handleEquipmentChange} 
                                options={equipments.map(e => ({value:e.id, label:e.name}))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="employees" label="İşçilər">
                    <Select 
                        mode="multiple" 
                        options={employees.map(emp => ({value:emp.id, label:`${emp.first_name} ${emp.last_name}`}))}
                    />
                </Form.Item>

                <Divider>Göstəricilər</Divider>

                {selectedVolumes.length > 0 && (
                    <Row gutter={12} className="production-form-header mb-2">
                        <Col span={4}><Text strong className="header-text">Həcm</Text></Col>
                        <Col span={4}><Text strong className="header-text">İstehsal saatı</Text></Col>
                        <Col span={4}><Text strong className="header-text">Hazır məhsul sayı</Text></Col>
                        <Col span={4}><Text strong className="header-text">İstehsal norması</Text></Col>
                        <Col span={4}><Text strong className="header-text">Səmərəlilik</Text></Col>
                    </Row>
                )}

                {selectedVolumes.map((vol, idx) => (
                    <Row gutter={12} key={vol.id} align="middle" className="mb-2">
                        <Col span={4}>
                            <Text strong>{vol.volume} L</Text>
                            <Form.Item name={['items', idx, 'volume']} initialValue={vol.id} hidden>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={['items', idx, 'production_hours']} noStyle>
                                <InputNumber min={0} max={24} className="w-full" placeholder="Saat"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={['items', idx, 'actual_count']} noStyle>
                                <InputNumber min={0} className="w-full" onChange={()=>handleCalc(idx)} placeholder="Sayı"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={['items', idx, 'target_norm']} noStyle>
                                <InputNumber min={0} className="w-full" onChange={()=>handleCalc(idx)} placeholder="Norma"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Tag color="cyan" className="w-full text-center py-1">
                                {calculatedEff[idx] || 0}%
                            </Tag>
                        </Col>
                    </Row>
                ))}

                <Form.Item name="note" label="Qeyd" className="mt-4">
                    <Input.TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductionFormModal;