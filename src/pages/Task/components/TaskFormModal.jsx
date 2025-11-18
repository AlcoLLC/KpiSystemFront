import { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import dayjs from 'dayjs';
import BaseModal from '../../../components/BaseModal';
import AppForm from '../../../components/AppForm';
import { getFormConfig } from '../../../features/tasks/utils/taskUtils.jsx';

const TaskFormModal = ({ open, mode, initialData, onCancel, onFinish, loading, users, usersLoading, permissions }) => {
  const [form] = Form.useForm();

    const formFields = useMemo(
    () => getFormConfig(users, usersLoading, permissions),
    [users, usersLoading, permissions]
  );
  
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        form.setFieldsValue({
          ...initialData,
          start_date: initialData.start_date ? dayjs(initialData.start_date) : null,
          due_date: initialData.due_date ? dayjs(initialData.due_date) : null,
        });
      } else { 
        form.resetFields();
        const defaultValues = permissions.formConfig?.defaultValues || {};

        form.setFieldsValue({
          ...defaultValues 
        });
      }
    }
  }, [open, mode, initialData, form, permissions]);


  
  const title = mode === 'add' ? 'Yeni Tapşırıq' : 'Tapşırığı Redaktə et';

  return (
    <BaseModal 
      title={title} 
      open={open} 
      onOk={() => form.submit()} 
      onCancel={onCancel} 
      confirmLoading={loading} 
      destroyOnClose
    >
      <AppForm form={form} fields={formFields} onFinish={onFinish} />
    </BaseModal>
  );
};

export default TaskFormModal;