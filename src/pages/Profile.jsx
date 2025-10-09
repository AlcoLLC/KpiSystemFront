import { Form, Input, Button, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useProfile from '../hooks/useProfile';

const { Dragger } = Upload;

function Profile() {
  const [form] = Form.useForm();

  const { loading, profileData, profilePhoto, onFinish, draggerProps } = useProfile(form);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#131920]">
        <span className="text-xl text-black dark:text-white">Yüklənir...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 text-black dark:bg-[#131920] dark:text-white">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="p-6 sm:p-8 rounded-xl shadow-md bg-white dark:bg-[#1B232D]"
      >
        <h1 className="text-2xl font-bold mb-8 border-b pb-4 text-gray-800 border-gray-200 dark:text-white dark:border-gray-700">
          Profil
        </h1>

        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Profil Şəkli</h2>
          <Dragger {...draggerProps}>
            <div className="p-4 flex flex-col justify-center items-center text-center">
              {profileData?.profile_photo || profilePhoto ? (
                <img
                  src={profilePhoto ? URL.createObjectURL(profilePhoto) : profileData.profile_photo}
                  alt="Profil"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem'
                  }}
                />
              ) : (
                <p className="ant-upload-drag-icon text-blue-500 dark:text-blue-300">
                  <UserOutlined style={{ fontSize: '64px' }} />
                </p>
              )}
              <p className="ant-upload-text font-semibold">
                {profilePhoto
                  ? profilePhoto.name
                  : 'Şəkli dəyişmək üçün klikləyin və ya sürüşdürüb buraxın'}
              </p>
              <p className="ant-upload-hint text-gray-500 dark:text-gray-400">
                JPG və ya PNG formatında, maksimum 2MB
              </p>
            </div>
          </Dragger>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            Profil Məlumatları
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Form.Item label="Ad" name="first_name">
              <Input placeholder="Adınız" size="large" />
            </Form.Item>
            <Form.Item label="Soyad" name="last_name">
              <Input placeholder="Soyadınız" size="large" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="E-poçt ünvanı" size="large" />
            </Form.Item>
            <Form.Item label="Əlaqə Nömrəsi" name="phone_number">
              <Input placeholder="Telefon nömrəsi" size="large" />
            </Form.Item>
            <Form.Item label="Vəzifə" name="role_display">
              <Input placeholder="Vəzifə" size="large" readOnly />
            </Form.Item>
            <Form.Item label="Departamentlər" name="all_departments">
  <Input placeholder="Aid olduğu departamentlər" size="large" readOnly />
</Form.Item>
            <Form.Item label="Şifrə" name="password" help="Dəyişmək istəmirsinizsə boş buraxın.">
              <Input.Password placeholder="Yeni şifrə" size="large" />
            </Form.Item>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button size="large" onClick={() => form.resetFields()}>
            Ləğv et
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Məlumatları Yadda Saxla
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Profile;
