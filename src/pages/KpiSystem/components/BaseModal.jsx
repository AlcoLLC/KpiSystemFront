import { Button } from "antd";

const BaseModal = ({
  open,
  onOk,
  onCancel,
  title,
  children,
  confirmLoading,
  okText,
  width,
  showCancelButton = true,
}) => {
  if (!open) return null;

  return (
    <div className="kpi-container">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto`}
        style={{ width: width || 520, maxWidth: "90vw" }}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="p-6">{children}</div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          {showCancelButton && (
            <Button onClick={onCancel}>
              Ləğv et
            </Button>
          )}
          <Button
            type="primary"
            onClick={onOk}
            loading={confirmLoading}
          >
            {okText || "Yadda saxala"}
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BaseModal;