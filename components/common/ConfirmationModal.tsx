import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import {
  IconCheck,
  IconInfoCircleFilled,
  IconAlertSquare,
  IconX,
  IconAlertCircle,
  IconHelpCircle,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  type?: 'success' | 'info' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  maxWidth = 'sm',
}) => {
  const getConfig = () => {
    const baseClasses = 'p-3 rounded-full mb-6 shadow-lg';
    switch (type) {
      case 'success':
        return {
          icon: (
            <div className={`${baseClasses} bg-green-100`}>
              <IconCheck size={40} className="text-green-600" strokeWidth={2.5} />
            </div>
          ),
          btnClass:
            'bg-green-600 hover:bg-green-700 text-white border-none hover:shadow-lg transition-all duration-200',
          borderColor: 'border-green-100',
        };
      case 'warning':
        return {
          icon: (
            <div className={`${baseClasses} bg-amber-100`}>
              <IconAlertSquare size={40} className="text-amber-600" strokeWidth={2} />
            </div>
          ),
          btnClass:
            'bg-amber-500 hover:bg-amber-600 text-white border-none hover:shadow-lg transition-all duration-200',
          borderColor: 'border-amber-100',
        };
      case 'danger':
        return {
          icon: (
            <div className={`${baseClasses} bg-red-100`}>
              <IconX size={40} className="text-red-600" strokeWidth={2.5} />
            </div>
          ),
          btnClass:
            'bg-red-600 hover:bg-red-700 text-white hover:!text-red-600  hover:!border-red-600 transition-all duration-200',
          borderColor: 'border-red-100',
        };
      case 'info':
      default:
        return {
          icon: (
            <div className={`${baseClasses} bg-blue-100`}>
              <IconHelpCircle size={40} className="text-orange-600" />
            </div>
          ),
          btnClass:
            '!bg-orange-500 text-white hover:!bg-white  border hover:shadow-md active:!bg-blue-700 transition-all duration-200 shadow-sm',
          borderColor: 'border-blue-100',
        };
    }
  };

  const { icon, btnClass, borderColor } = getConfig();

  const modalWidth =
    maxWidth === 'xs'
      ? 360
      : maxWidth === 'sm'
        ? 480
        : maxWidth === 'md'
          ? 720
          : maxWidth === 'lg'
            ? 960
            : maxWidth === 'xl'
              ? 1200
              : 500;

  const handleClose = () => {
    setTimeout(onClose, 200); // Wait for animation to complete
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      centered
      width={modalWidth}
      footer={null}
      closeIcon={null}
      className="confirmation-modal"
      styles={{
        content: {
          borderRadius: '16px',
          overflow: 'hidden',
          padding: '0',
        },
        body: {
          padding: '0',
        },
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="p-8"
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close"
            >
              <IconX size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                type: 'spring',
                stiffness: 500,
                damping: 20,
              }}
            >
              {icon}
            </motion.div>

            <motion.h3
              className="text-xl  text-font-color mb-3 mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {typeof message === 'string' ? <p>{message}</p> : message}
            </motion.h3>

            {/* <motion.div 
                className="text-gray-600 mb-8 leading-relaxed"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {typeof message === "string" ? <p>{message}</p> : message}
              </motion.div> */}

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full mt-6">
              <motion.div
                className="w-full sm:w-auto"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  block
                  size="large"
                  onClick={handleClose}
                  disabled={loading}
                  className="h-[40px] rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-base"
                >
                  {cancelText}
                </Button>
              </motion.div>

              <motion.div
                className="w-full sm:w-auto"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Button
                  block
                  size="large"
                  onClick={handleConfirm}
                  loading={loading}
                  disabled={loading}
                  className={`h-[40px] rounded-lg font-medium text-base ${btnClass}`}
                >
                  {confirmText}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default ConfirmationModal;
