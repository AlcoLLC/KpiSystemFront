import { useEffect, useState, useContext } from "react";
import { message } from "antd";
import AuthContext from "../context/AuthContext";
import accountsApi from "../api/accountsApi";

const useProfile = (form) => {
  const { setUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!localStorage.getItem("tokens")) {
        setLoading(false);
        message.error("Məlumatları görmək üçün daxil olmalısınız.");
        return;
      }

      try {
        const response = await accountsApi.getProfile();
        const userData = response.data;

        if (userData) {
          setProfileData(userData);
          const formData = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone_number: userData.phone_number,
            role_display: userData.role_display,
            department: userData.department_name || "Təyin edilməyib",
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
        } else {
          message.error("Profil məlumatlarını yükləmək mümkün olmadı.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [form, setUser]);

  const onFinish = async (values) => {
    if (!profileData) {
      message.error("Profil məlumatları yüklənməyib, yeniləmə mümkün deyil.");
      return;
    }

    if (!values.password) {
      delete values.password;
    }

    const { role_display, department, ...submitValues } = values;

    const formData = new FormData();
    Object.keys(submitValues).forEach((key) => {
      if (
        submitValues[key] !== null &&
        submitValues[key] !== undefined &&
        submitValues[key] !== ""
      ) {
        formData.append(key, submitValues[key]);
      }
    });

    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto);
    }

    try {
      const response = await accountsApi.updateProfile(formData);
      message.success("Profil məlumatları uğurla yeniləndi!");

      const updatedUser = response.data;
      setProfileData(updatedUser);
      setProfilePhoto(null);

      form.setFieldsValue({
        ...updatedUser,
        role_display: updatedUser.role_display,
        department: updatedUser.department_name || "Təyin edilməyib",
      });

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profil yenilənərkən xəta:", error.response?.data || error);

      if (error.response?.data) {
        const errorData = error.response.data;
        Object.keys(errorData).forEach((key) => {
          const errorMessages = Array.isArray(errorData[key])
            ? errorData[key]
            : [errorData[key]];
          errorMessages.forEach((msg) => {
            message.error(`${key}: ${msg}`);
          });
        });
      } else {
        message.error("Məlumatları yeniləmək mümkün olmadı.");
      }
    }
  };

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
        setProfilePhoto(file);
      }

      return false;
    },
  };

  return {
    loading,
    profileData,
    profilePhoto,
    onFinish,
    draggerProps,
  };
};

export default useProfile;
