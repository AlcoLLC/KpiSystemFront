import { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Row, Col, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import accountsApi from '../../../../api/accountsApi';

const FactoryUserForm = ({ form, onFinish, isEdit = false }) => {
  const [fPositions, setFPositions] = useState([]);

  const FACTORY_ROLES = [
    { value: "admin", label: "Admin" },
    { value: "top_management", label: "Zavod Direktoru" },
    { value: "deputy_director", label: "Zavod Direktoru Müavini" },
    { value: "department_lead", label: "Bölmə Rəhbəri" },
    { value: "employee", label: "İşçi" },
  ];

  const FACTORY_TYPES = [
    { value: "dolum", label: "Dolum" },
    { value: "bidon", label: "Bidon" },
  ];

  useEffect(() => {
    accountsApi.getFactoryPositions().then(res => setFPositions(res.data.results || res.data));
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Row gutter={16}>
        <Col span={12}><Form.Item name="first_name" label="Ad" rules={[{ required: true }]}><Input /></Form.Item></Col>
        <Col span={12}><Form.Item name="last_name" label="Soyad" rules={[{ required: true }]}><Input /></Form.Item></Col>
        <Col span={12}><Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item></Col>        
        <Col span={12}>
          <Form.Item name="factory_type" label="Zavod Tipi" rules={[{ required: true }]}>
            <Select options={FACTORY_TYPES} placeholder="Seçin" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="factory_role" label="Rol" rules={[{ required: true }]}>
            <Select options={FACTORY_ROLES} placeholder="Rol seçin" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="factory_position" label="Zavod Vəzifəsi">
            <Select showSearch optionFilterProp="children" placeholder="Vəzifə seçin">
              {fPositions.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="password" label="Şifrə" rules={[{ required: !isEdit }]}>
            <Input.Password placeholder={isEdit ? "Dəyişmirsə boş buraxın" : ""} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="profile_photo" label="Profil Şəkli" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Şəkil Seç</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FactoryUserForm;