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

      console.log("User Data:", userData);

      if (userData) {
        setProfileData(userData);
        
        const isFactory = !!userData.factory_role; 
        setIsFactoryUser(isFactory);

        let departmentsString = "Yoxdur";
        if (userData.all_departments?.length > 0) {
          departmentsString = userData.all_departments.join(", ");
        }

        const formValues = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone_number: userData.phone_number,
          
          role_display: userData.role_display || "Təyin edilməyib", 
          
          all_departments: departmentsString,
          
          factory_type: userData.factory_type_display || "",

          position_display: userData.position_details?.name || "Təyin edilməyib",
        };
        
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