import { Tabs } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  SettingOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import FactoryUsersTab from "./components/FactoryUsersTab";
import FactoryPositionsTab from "./components/FactoryPositionsTab";
import EquipmentsTab from "./components/EquipmentsTab";
import VolumesTab from "./components/VolumesTab";
const UserManagement = () => {
  const TabLabel = ({ icon, title }) => (
    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
      {icon}
      {title}
    </span>
  );
  const items = [
    {
      key: "1",
      label: <TabLabel icon={<UserOutlined />} title="İstifadəçilər" />,
      children: <FactoryUsersTab />,
    },
    {
      key: "2",
      label: <TabLabel icon={<SolutionOutlined />} title="Vəzifələr" />,
      children: <FactoryPositionsTab />,
    },
    {
      key: "3",
      label: <TabLabel icon={<SettingOutlined />} title="Avadanlıqlar" />,
      children: <EquipmentsTab />,
    },
    {
      key: "4",
      label: <TabLabel icon={<ContainerOutlined />} title="Bidon Tirajları" />,
      children: <VolumesTab />,
    },
  ];

  return (
    <div className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Zavod Məlumatları
      </h2>
      <div className="p-4 sm:p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default UserManagement;
