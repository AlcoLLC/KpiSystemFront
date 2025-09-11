import React from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';

/**
 * @param {boolean} open 
 * @param {function} onOk 
 * @param {function} onCancel 
 * @param {string | React.ReactNode} title 
 * @param {React.ReactNode} children 
 * @param {number} width 
 * @param {string} okText 
 * @param {string} cancelText 
 * @param {React.ReactNode | null} footer 
 */
function BaseModal({
  open,
  onOk,
  onCancel,
  title,
  children,
  width = 700,
  okText = 'Yadda saxla',
  cancelText = 'Ləğv et',
  footer
}) {
  const isDark = useSelector((state) => state.theme.isDark);

  const modalStyles = {
    body: {
      backgroundColor: isDark ? '#1B232D' : '#fff'
    },
    closeIcon: {
      color: isDark ? '#fff' : '#000',
      fontWeight: 'bold',
      fontSize: '22px'
    },
    okButton: isDark ? { 
      backgroundColor: '#3379F5', 
      borderColor: '#3379F5', 
      color: '#fff' 
    } : {},
    cancelButton: isDark ? {
      color: '#fff',
      borderColor: '#2A3442',
      backgroundColor: '#131920'
    } : {}
  };

  return (
    <Modal
      title={<span className={isDark ? 'text-white' : 'text-black'}>{title}</span>}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      okText={okText}
      cancelText={cancelText}
      footer={footer}
      bodyStyle={modalStyles.body}
      closeIcon={<span style={modalStyles.closeIcon}>×</span>}
      className={isDark ? 'dark-modal' : ''}
      okButtonProps={{ style: modalStyles.okButton }}
      cancelButtonProps={{ style: modalStyles.cancelButton }}
    >
      {children}
    </Modal>
  );
}

export default BaseModal;