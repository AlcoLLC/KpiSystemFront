import { useEffect, useState, useContext } from "react";
import { message } from "antd";
import AuthContext from "../context/AuthContext";
import accountsApi from "../api/accountsApi";

const useProfile = (form) => {
  const { setUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isFactoryUser, setIsFactoryUser] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!localStorage.getItem("tokens")) {
        setLoading(false);
        return;
      }
      try {
        const response = await accountsApi.getProfile();
        const userData = response.data;

        // DEBUG: Məlumatları yoxlayırıq
        console.log("User Data:", userData);

        if (userData) {
          setProfileData(userData);
          
          // Factory istifadəçi yoxlanışı
          // factory_role varsa (null və ya boş deyilsə) true olacaq
          const isFactory = !!userData.factory_role; 
          setIsFactoryUser(isFactory);

          let departmentsString = "Təyin edilməyib";
          if (userData.all_departments?.length > 0) {
            departmentsString = userData.all_departments.join(", ");
          }

          const formatFactoryType = (type) => {
              if(!type) return "";
              const strType = String(type);
              return strType.charAt(0).toUpperCase() + strType.slice(1);
          };

          // Dəyişənin adı formValues-dur
          const formValues = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone_number: userData.phone_number,
            
            role_display: userData.role_display, 
            factory_role_display: userData.factory_role_display || userData.role_display,
            
            all_departments: departmentsString,
            
            factory_type: formatFactoryType(userData.factory_type),

            position_display: userData.position_details?.name || "Təyin edilməyib",
          };
          
          // DÜZƏLİŞ BURADA: formData əvəzinə formValues yazıldı
          form.setFieldsValue(formValues);
        }
      } catch (error) {
        console.error("Profil xətası:", error);
        if (error.response?.status !== 401) {
          message.error("Profil yüklənmədi.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [form, setUser]);

  const onFinish = async (values) => {
    if (!profileData) {
        message.error("Məlumat yoxdur");
        return;
    }

    // ReadOnly sahələri təmizləyirik
    const { 
        role_display, 
        factory_role_display, 
        all_departments, 
        factory_type, 
        position_display, 
        ...submitValues 
    } = values;

    if (!submitValues.password) {
        delete submitValues.password;
    }

    // Serverə göndəriləcək FormData (bu ayrı dəyişəndir)
    const formData = new FormData();
    Object.keys(submitValues).forEach((key) => {
      if (submitValues[key] !== null && submitValues[key] !== undefined && submitValues[key] !== "") {
        formData.append(key, submitValues[key]);
      }
    });
    
    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto);
    }

    try {
      const response = await accountsApi.updateProfile(formData);
      message.success("Yeniləndi!");
      
      const updatedUser = response.data;
      setProfileData(updatedUser);
      setUser(updatedUser);
      setProfilePhoto(null);
      
      setIsFactoryUser(!!updatedUser.factory_role);

    } catch (error) {
      console.error(error);
      message.error("Xəta baş verdi");
    }
  };

  const draggerProps = {
     name: "file",
     multiple: false,
     showUploadList: false,
     beforeUpload: (file) => {
        setProfilePhoto(file);
        return false;
     }
  };

  return {
    loading,
    profileData,
    profilePhoto,
    isFactoryUser, 
    onFinish,
    draggerProps,
  };
};

export default useProfile;