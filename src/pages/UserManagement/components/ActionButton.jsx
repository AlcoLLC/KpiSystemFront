import React from 'react';
import { Tooltip } from 'antd';

const ActionButton = ({ icon, tooltip, onClick, colorClass }) => (
    <button
      onClick={(e) => {
         e.stopPropagation();
        onClick();
      }}
       className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${colorClass}`}
    >
      {icon}
    </button>
);

export default ActionButton;