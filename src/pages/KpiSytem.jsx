import React, { useState, useContext } from "react";
import { Card, Button, Slider, Input, Row, Col, Rate } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import BaseModal from "../components/BaseModal";
import AuthContext from "../context/AuthContext";
const { TextArea } = Input;

const BlockContent = ({ name, task, date, onReview }) => (
  <Card
    className="h-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    title={
      <div className="flex items-center text-blue-600">
        <UserOutlined className="mr-2" />
        <span className="font-bold">{name}</span>
      </div>
    }
    hoverable
  >
    <div className="space-y-4">
      <div className="flex items-start">
        <MessageOutlined className="text-blue-500 mr-2 mt-1" />
        <div>
          <div className="text-sm text-gray-500 mb-1">Tapşırıq:</div>
          <div className="font-medium text-gray-800">{task}</div>
        </div>
      </div>

      <div className="flex items-center text-gray-600">
        <CalendarOutlined className="text-green-500 mr-2" />
        <span className="text-sm">{date}</span>
      </div>

      <Button
        type="primary"
        block
        size="large"
        icon={<StarOutlined />}
        onClick={onReview}
        className="mt-4 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
      >
        Qiymətləndirin
      </Button>
    </div>
  </Card>
);

const ReviewModal = ({ isOpen, onClose, name }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [score, setScore] = useState(85);
  const [starRating, setStarRating] = useState(4);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (isAuthenticated) {
      console.log("Star Rating:", starRating, "Note:", note);
    } else {
      console.log("Score:", score, "Note:", note);
    }
    onClose();
  };

  const resetModal = () => {
    setScore(85);
    setStarRating(4);
    setNote("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      onOk={handleSave}
      onCancel={handleClose}
      title={`Rəy - ${name}`}
      width={500}
    >
      <div className="space-y-6">
        <div>
          {isAuthenticated ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Qiymətləndirmə (10 üzərindən):
                </label>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold min-w-[60px] text-center shadow-md">
                  {starRating}/10
                </div>
              </div>

              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="mb-3">
                  <StarOutlined className="text-yellow-500 text-lg mr-2" />
                  <span className="text-gray-600 font-medium">
                    Yıldız seçin:
                  </span>
                </div>

                <Rate
                  count={10}
                  value={starRating}
                  onChange={setStarRating}
                  style={{ fontSize: "28px" }}
                  className="custom-rate"
                />

                <div className="flex justify-between w-full mt-3 text-xs text-gray-400 px-2">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
              </div>

              <div className="mt-3 text-center">
                <div className="text-sm text-gray-500">
                  {starRating <= 3 && (
                    <span className="text-red-500 font-medium">
                      🔴 Performans təkmilləşdirilməlidir
                    </span>
                  )}
                  {starRating > 3 && starRating <= 6 && (
                    <span className="text-orange-500 font-medium">
                      🟡 Orta səviyyədə performans
                    </span>
                  )}
                  {starRating > 6 && starRating <= 8 && (
                    <span className="text-blue-500 font-medium">
                      🔵 Yaxşı performans
                    </span>
                  )}
                  {starRating > 8 && (
                    <span className="text-green-500 font-medium">
                      🟢 Əla performans
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Bal (Score):
                </label>
                <div className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold min-w-[50px] text-center">
                  {score}
                </div>
              </div>
              <Slider
                min={1}
                max={100}
                value={score}
                onChange={setScore}
                className="mb-2"
                trackStyle={{ backgroundColor: "#1890ff" }}
                handleStyle={{ borderColor: "#1890ff" }}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
          )}
        </div>

        {/* Note Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Qeyd (Note):
          </label>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Qeydlərinizi buraya yazın..."
            rows={4}
            className="resize-none"
          />
        </div>
      </div>

      {/* Custom CSS for Rate component */}
      <style jsx>{`
        .custom-rate .ant-rate-star {
          margin-right: 8px;
        }
        .custom-rate .ant-rate-star-zero .ant-rate-star-first,
        .custom-rate .ant-rate-star-zero .ant-rate-star-second {
          color: #d9d9d9;
        }
        .custom-rate .ant-rate-star-full .ant-rate-star-first,
        .custom-rate .ant-rate-star-full .ant-rate-star-second {
          color: #faad14;
        }
        .custom-rate .ant-rate-star-half .ant-rate-star-first {
          color: #faad14;
        }
        .custom-rate .ant-rate-star:hover {
          transform: scale(1.1);
          transition: transform 0.2s;
        }
      `}</style>
    </BaseModal>
  );
};

function KpiSytem() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");

  const employees = [
    {
      name: "Əhməd Məmmədov",
      task: "Frontend Development",
      date: "2024-09-15",
    },
    { name: "Ayşə Həsənova", task: "UI/UX Design", date: "2024-09-14" },
    { name: "Rəşad Əliyev", task: "Backend Development", date: "2024-09-13" },
    { name: "Leyla Qasımova", task: "Quality Assurance", date: "2024-09-12" },
    { name: "Elnur Hüseynov", task: "DevOps Operations", date: "2024-09-11" },
    { name: "Günel İsmayılova", task: "Data Analysis", date: "2024-09-10" },
    { name: "Tural Babayev", task: "Mobile Development", date: "2024-09-09" },
    { name: "Səbinə Rəhimova", task: "Project Management", date: "2024-09-08" },
    {
      name: "Kərim Nərimanov",
      task: "System Architecture",
      date: "2024-09-07",
    },
  ];

  const handleReview = (name) => {
    setSelectedPerson(name);
    setModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              KPI İdarəetmə Sistemi
            </h1>
            <p className="text-gray-600 text-lg">
              İşçilərin performansını qiymətləndirin və izləyin
            </p>

            {isAuthenticated && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <StarOutlined className="mr-2" />
                <span className="font-medium">
                  Xoş gəldiniz, {user?.first_name || user?.email}!
                </span>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <UserOutlined className="mr-2" />
                <span className="font-medium">
                  Misafir kullanıcı - 100 üzerinden değerlendirme sistemi
                </span>
              </div>
            )}
          </div>

          {/* Grid using Ant Design */}
          <Row gutter={[24, 24]}>
            {employees.map((employee, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <BlockContent
                  name={employee.name}
                  task={employee.task}
                  date={employee.date}
                  onReview={() => handleReview(employee.name)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        name={selectedPerson}
      />
    </>
  );
}

export default KpiSytem;
