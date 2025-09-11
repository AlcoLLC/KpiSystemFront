import React from 'react';
import { useSelector } from 'react-redux';
import { Descriptions, Spin } from 'antd';

/**
 * @param {Array} items 
 * @param {boolean} loading 
 */
function Details({ items, loading = false }) {
  const isDark = useSelector((state) => state.theme.isDark);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>;
  }

  return (
    <Descriptions
      bordered
      column={1}
      size="small"
      labelStyle={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '500', width: '180px' }}
      contentStyle={{ color: isDark ? '#ffffff' : '#000000' }}
    >
      {items.map(item => (
        <Descriptions.Item key={item.key || item.label} label={item.label}>
          {item.value}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}

export default Details;