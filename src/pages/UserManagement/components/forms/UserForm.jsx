import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, message, Row, Col, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import accountsApi from '../../../../api/accountsApi';

const UserForm = ({ form, onFinish, isEdit = false, initialValues }) => {
    const selectedRole = Form.useWatch('role', form);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [deptsLoading, setDeptsLoading] = useState(false);

    const ROLE_CHOICES = [
        { value: "top_management", label: "Yuxarı İdarəetmə" },
        { value: "department_lead", label: "Departament Rəhbəri" },
        { value: "manager", label: "Menecer" },
        { value: "employee", label: "İşçi" },
    ];

    // Vəzifələri bir dəfə yükləyirik
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const posRes = await accountsApi.getPositions();
                setPositions(posRes.data.results || posRes.data || []);
            } catch {
                message.error("Vəzifələri yükləmək mümkün olmadı.");
            }
        };
        fetchPositions();
    }, []);

    // Departamentləri isə yalnız "rol" dəyişdikdə yükləyirik
    useEffect(() => {
        const fetchDepartments = async () => {
            if (!selectedRole) {
                setDepartments([]);
                return;
            }
            
            setDeptsLoading(true);
            try {
                let deptRes;
                if (['department_lead', 'manager'].includes(selectedRole)) {
                    deptRes = await accountsApi.getAvailableDepartments(selectedRole);
                } else if (['employee', 'top_management'].includes(selectedRole)) {
                    deptRes = await accountsApi.getDepartments();
                } else {
                    setDepartments([]);
                    setDeptsLoading(false);
                    return;
                }
                setDepartments(deptRes.data.results || deptRes.data || []);
            } catch (error) {
                message.error("Departamentləri yükləmək mümkün olmadı.");
            } finally {
                setDeptsLoading(false);
            }
        };
        
        fetchDepartments();
    }, [selectedRole]);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={16}>
                <Col span={12}><Form.Item name="first_name" label="Ad" rules={[{ required: true }]}><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="last_name" label="Soyad" rules={[{ required: true }]}><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="phone_number" label="Telefon"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="password" label="Şifrə" rules={[{ required: !isEdit, message: 'Yeni istifadəçi üçün şifrə mütləqdir!' }]}><Input.Password placeholder={isEdit ? "Dəyişmirsə boş buraxın" : ""} autoComplete="new-password" /></Form.Item></Col>
                <Col span={12}><Form.Item name="role" label="Rol" rules={[{ required: true }]}><Select options={ROLE_CHOICES} onChange={() => form.setFieldsValue({ department: null, top_managed_departments: [] })} /></Form.Item></Col>
                
                {['employee', 'manager', 'department_lead'].includes(selectedRole) && (
                    <Col span={12}>
                        <Form.Item name="department" label="Departament" rules={[{ required: true }]}>
                            <Select showSearch optionFilterProp="children" loading={deptsLoading} placeholder="Departament seçin" allowClear>
                                {departments.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                )}
                
                {selectedRole === 'top_management' && (
                     <Col span={24}>
                        <Form.Item name="top_managed_departments" label="İdarə Edilən Departamentlər">
                            <Select mode="multiple" allowClear showSearch optionFilterProp="children" loading={deptsLoading} placeholder="Departamentləri seçin">
                                {departments.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                )}

                <Col span={12}>
                    <Form.Item name="position" label="Vəzifə">
                        <Select showSearch optionFilterProp="children" placeholder="Vəzifə seçin" allowClear>
                            {positions.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>

                 <Col span={12}>
                     <Form.Item 
                        name="profile_photo" 
                        label="Profil Şəkli" 
                        valuePropName="fileList" 
                        getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload 
                            maxCount={1} 
                            beforeUpload={() => false} 
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Şəkil Seç</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default UserForm;