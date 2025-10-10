import React, { useState, useEffect } from 'react';
import { Form, Input, Select, message } from 'antd';
import accountsApi from '../../../../api/accountsApi';

const DepartmentForm = ({ form, onFinish, initialValues }) => {
    const [leads, setLeads] = useState([]);
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [leadsRes, managersRes] = await Promise.all([
                    accountsApi.getUsers({ role: 'department_lead' }),
                    accountsApi.getUsers({ role: 'manager' }),
                ]);
                setLeads(leadsRes.data.results || leadsRes.data);
                setManagers(managersRes.data.results || managersRes.data);
            } catch (error) {
                message.error("Rəhbər və menecer siyahısını yükləmək olmadı.");
            }
        };
        fetchUsers();
    }, []);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item name="name" label="Departament Adı" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="department_lead" label="Departament Rəhbəri (Lead)">
                <Select showSearch optionFilterProp="children" allowClear>
                    {leads.map(u => <Select.Option key={u.id} value={u.id}>{`${u.first_name} ${u.last_name}`}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="manager" label="Menecer">
                <Select showSearch optionFilterProp="children" allowClear>
                    {managers.map(u => <Select.Option key={u.id} value={u.id}>{`${u.first_name} ${u.last_name}`}</Select.Option>)}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default DepartmentForm;