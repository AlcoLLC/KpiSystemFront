import React from "react";
import { Form, Input, Button, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import useProfile from "../hooks/useProfile";

const { Dragger } = Upload;

function Profile() {
  const [form] = Form.useForm();
  const isDark = useSelector((state) => state.theme.isDark);

  const { loading, profileData, profilePhoto, onFinish, draggerProps } =
    useProfile(form);

  const formItemClass = isDark ? "form-item-dark" : "";

  if (loading) {
    return <div>Yüklənir...</div>;
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDark ? "bg-[#1B232D] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <style>{`
        .form-item-dark .ant-form-item-label > label { color: white !important; }
        .ant-upload-wrapper .ant-upload-drag p.ant-upload-text { ${
          isDark ? "color: white !important;" : ""
        } }
        ${
          isDark
            ? `
            .ant-input, .ant-input-password, .ant-select-selector, .ant-input-affix-wrapper {
              background-color: #2a3441 !important;
              color: #e2e8f0 !important;
              border-color: #4a5568 !important;
            }
            .ant-input::placeholder, .ant-select-selection-placeholder { color: #a0aec0 !important; }
            .ant-select-selection-item, .ant-input-password-icon, .ant-select-arrow { color: #e2e8f0 !important; }
            .ant-upload-drag p.ant-upload-hint { color: #a0aec0 !important; }
            .ant-form-item-extra, .ant-form-item-with-help .ant-form-item-explain { color: #a0aec0 !important; }
            .ant-btn-default {
              background-color: #2a3441 !important;
              color: #e2e8f0 !important;
              border-color: #4a5568 !important;
            }
            `
            : ""
        }
      `}</style>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={`mx-auto p-6 sm:p-8 rounded-xl shadow-md ${
          isDark ? "bg-[#1B232D]" : "bg-white"
        }`}
      >
        <h1
          className={`text-2xl font-bold mb-8 border-b pb-4 ${
            isDark
              ? "text-white border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          Profil
        </h1>

        <div className="mb-10">
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-700"
            }`}
          >
            Profil Şəkli
          </h2>
          <Dragger {...draggerProps}>
            <div className="p-4 flex flex-col justify-center items-center text-center">
              {profileData?.profile_photo || profilePhoto ? (
                <img
                  src={
                    profilePhoto
                      ? URL.createObjectURL(profilePhoto)
                      : profileData.profile_photo
                  }
                  alt="Profil"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "1rem",
                  }}
                />
              ) : (
                <p
                  className={`ant-upload-drag-icon ${
                    isDark ? "text-blue-300" : "text-blue-500"
                  }`}
                >
                  <UserOutlined style={{ fontSize: "64px" }} />
                </p>
              )}
              <p className={`ant-upload-text font-semibold`}>
                {profilePhoto
                  ? profilePhoto.name
                  : "Şəkli dəyişmək üçün klikləyin və ya sürüşdürüb buraxın"}
              </p>
              <p
                className={`ant-upload-hint ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                JPG və ya PNG formatında, maksimum 2MB
              </p>
            </div>
          </Dragger>
        </div>

        <div>
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-700"
            }`}
          >
            Profil Məlumatları
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Form.Item label="Ad" name="first_name" className={formItemClass}>
              <Input placeholder="Adınız" size="large" />
            </Form.Item>
            <Form.Item label="Soyad" name="last_name" className={formItemClass}>
              <Input placeholder="Soyadınız" size="large" />
            </Form.Item>
            <Form.Item label="Email" name="email" className={formItemClass}>
              <Input type="email" placeholder="E-poçt ünvanı" size="large" />
            </Form.Item>
            <Form.Item
              label="Əlaqə Nömrəsi"
              name="phone_number"
              className={formItemClass}
            >
              <Input placeholder="Telefon nömrəsi" size="large" />
            </Form.Item>
            <Form.Item
              label="Vəzifə"
              name="role_display"
              className={formItemClass}
            >
              <Input placeholder="Vəzifə" size="large" readOnly />
            </Form.Item>
            <Form.Item
              label="Department"
              name="department"
              className={formItemClass}
            >
              <Input placeholder="Şöbə" size="large" readOnly />
            </Form.Item>
            <Form.Item
              label="Şifrə"
              name="password"
              help="Dəyişmək istəmirsinizsə boş buraxın."
              className={formItemClass}
            >
              <Input.Password placeholder="Yeni şifrə" size="large" />
            </Form.Item>
          </div>
        </div>

        <div
          className={`flex justify-end gap-4 mt-8 pt-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
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
