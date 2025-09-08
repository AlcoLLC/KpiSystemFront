import React from "react";
import { Form, Input, Button, Select, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Dragger } = Upload;

const draggerProps = {
  name: "file",
  multiple: false,
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  showUploadList: false,
  beforeUpload: (file) => {
    return true;
  },
  onChange(info) {
    if (info.file.status === "done") {
      console.log(`${info.file.name} dosyası başarıyla yüklendi.`);
    } else if (info.file.status === "error") {
      console.error(`${info.file.name} dosyası yüklenirken hata oluştu.`);
    }
  },
};

function Profile() {
  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
  };

  const onFinish = (values) => {
    console.log("Form gönderildi:", values);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <Form
        layout="vertical"
        initialValues={initialFormValues}
        onFinish={onFinish}
        className=" mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">
          Settings
        </h1>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Profile Photo
          </h2>
          <Dragger {...draggerProps}>
            <div className="p-4 flex flex-col justify-center items-center text-center">
              <p className="ant-upload-drag-icon text-gray-300">
                <UserOutlined style={{ fontSize: "64px" }} />
              </p>
              <p className="ant-upload-text text-gray-600 font-semibold">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint text-gray-400">
                Support for a single upload. Strictly prohibit from uploading
                company data or other band files.
              </p>
            </div>
          </Dragger>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Form.Item label="First Name" name="firstName">
              <Input placeholder="First name" size="large" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName">
              <Input placeholder="Last name" size="large" />
            </Form.Item>
            <Form.Item label="Email Address" name="email">
              <Input type="email" placeholder="Email address" size="large" />
            </Form.Item>
            <Form.Item label="Phone No" name="phone">
              <Input placeholder="Phone no" size="large" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              help="Leave blank if you don't want to change it."
            >
              <Input.Password placeholder="New Password" size="large" />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPassword">
              <Input.Password placeholder="Confirm New Password" size="large" />
            </Form.Item>
            <div className="sm:col-span-2">
              <Form.Item label="Address" name="address">
                <Input placeholder="Add address here" size="large" />
              </Form.Item>
            </div>
            <div className="sm:col-span-2">
              <Form.Item label="Country" name="country">
                <Select placeholder="Select" size="large">
                  <Option value="switzerland">Switzerland</Option>
                  <Option value="usa">United States</Option>
                  <Option value="germany">Germany</Option>
                  <Option value="turkey">Turkey</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="sm:col-span-2">
              <Form.Item label="Add Your Bio" name="bio">
                <Input.TextArea rows={4} placeholder="Write your description" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button size="large" onClick={() => console.log("İptal edildi")}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Information
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Profile;
