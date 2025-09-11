import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'antd';

function ReusableTable({ columns, dataSource, onRowClick, pagination = false, loading = false }) {
  const isDark = useSelector((state) => state.theme.isDark);

  const handleRow = (record) => ({
    onClick: () => {
      if (onRowClick) {
        onRowClick(record);
      }
    }
  });

  return (
    <div
      className={`p-4 rounded-lg shadow transition duration-500 ${isDark ? 'bg-[#131920]' : ''}`}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey="id"
        loading={loading}
        className={isDark ? 'dark-table' : 'light-table'}
        rowClassName={() =>
          isDark
            ? 'bg-[#1B232D] text-white hover:bg-[#2A3440] cursor-pointer'
            : 'bg-white text-black hover:bg-gray-100 cursor-pointer'
        }
        onRow={handleRow}
      />
    </div>
  );
}

export default ReusableTable;
