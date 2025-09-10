// components/Profile.jsx

import React, { useEffect, useState, useContext } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import AuthContext from "../context/AuthContext";
import accountsApi from "../api/accountsApi";

const { Dragger } = Upload;

function Profile() {
  const [form] = Form.useForm();
  const isDark = useSelector((state) => state.theme.isDark);
  const { user, setUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      // Token yoxdursa, sorğu göndərməyə ehtiyac yoxdur
      if (!localStorage.getItem("tokens")) {
        setLoading(false);
        message.error("Məlumatları görmək üçün daxil olmalısınız.");
        return;
      }

      try {
        // Birbaşa istifadəçinin profilini çəkirik
        const response = await accountsApi.getProfile();
        const userProfile = response.data;

        if (userProfile) {
          setProfileData(userProfile); // Bütün profil obyektini state-ə yazırıq

          // Formu doldururuq
          const formData = {
            first_name: userProfile.user.first_name,
            last_name: userProfile.user.last_name,
            email: userProfile.user.email,
            phone_number: userProfile.phone_number,
            role: userProfile.user.role_display,
            department: userProfile.user.department_name || "Təyin edilməyib",
          };
          form.setFieldsValue(formData);
        } else {
          message.error("Profil məlumatları tapılmadı.");
        }
      } catch (error) {
        console.error("Profil məlumatları çəkilərkən xəta baş verdi:", error);
        if (error.response?.status === 401) {
          message.error(
            "Sessiyanızın vaxtı bitib. Zəhmət olmasa, yenidən daxil olun."
          );
          // Burada logout funksiyasını çağırıb login səhifəsinə yönləndirə bilərsiniz.
        } else {
          message.error("Profil məlumatlarını yükləmək mümkün olmadı.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [form]);

  const onFinish = async (values) => {
    // onFinish başladığı anda profileData-nın null olub-olmadığını yoxlayırıq
    if (!profileData) {
      message.error("Profil məlumatları yüklənməyib, yeniləmə mümkün deyil.");
      return;
    }

    if (!values.password) {
      delete values.password;
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto);
    }

    try {
      // Artıq id göndərməyə ehtiyac yoxdur
      const response = await accountsApi.updateProfile(formData);
      message.success("Profil məlumatları uğurla yeniləndi!");

      const updatedProfile = response.data;
      setProfileData(updatedProfile);
      setProfilePhoto(null); // Yükləmə bitdikdən sonra şəkli sıfırlayırıq

      // Context və LocalStorage-dəki user məlumatını da yeniləyirik
      const updatedUser = updatedProfile.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profil yenilənərkən xəta:", error.response?.data || error);
      message.error("Məlumatları yeniləmək mümkün olmadı.");
    }
  };

  // Fayl yükləmə və digər hissələr dəyişməz qalır...
  // ... (draggerProps, JSX, və s.)
  // Fayl yükləmə ayarları
  const draggerProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Yalnız JPG/PNG formatlı şəkil yükləyə bilərsiniz!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Şəkil ölçüsü 2MB-dan böyük olmamalıdır!");
      }

      if (isJpgOrPng && isLt2M) {
        setProfilePhoto(file); // Şəkli state-də saxlayırıq
      }

      return false; // avtomatik yükləmənin qarşısını alırıq
    },
  };

  const formItemClass = isDark ? "form-item-dark" : "";

  if (loading) {
    return <div>Yüklənir...</div>; // və ya bir Ant Design Spinner komponenti
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDark ? "bg-[#1B232D] text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Stil kodları dəyişdirilməyib... */}
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
          Settings
        </h1>

        <div className="mb-10">
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-700"
            }`}
          >
            Profile Photo
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
            Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Form.Item
              label="First Name"
              name="first_name"
              className={formItemClass}
            >
              <Input placeholder="Adınız" size="large" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              className={formItemClass}
            >
              <Input placeholder="Soyadınız" size="large" />
            </Form.Item>
            <Form.Item
              label="Email Address"
              name="email"
              className={formItemClass}
            >
              <Input type="email" placeholder="E-poçt ünvanı" size="large" />
            </Form.Item>
            <Form.Item
              label="Phone No"
              name="phone_number"
              className={formItemClass}
            >
              <Input placeholder="Telefon nömrəsi" size="large" />
            </Form.Item>
            <Form.Item label="Role" name="role" className={formItemClass}>
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
              label="New Password"
              name="password"
              help="Dəyişmək istəmirsinizsə boş buraxın."
              className={`${formItemClass} sm:col-span-2`}
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
