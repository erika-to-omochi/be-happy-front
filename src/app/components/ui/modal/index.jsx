import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../loading-spinner';

const Modal = ({ selectedMemory, onClose, onTransform, isLoading }) => {
  return (
    <AnimatePresence>
      {selectedMemory && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                &#10005;
              </button>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">詳細情報</h2>
                <div className="text-lg font-semibold">入力内容</div>
                <div className="mb-4">{selectedMemory.content.inputContent}</div>

                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <p className="text-lg font-semibold">Loading...</p>
                    <LoadingSpinner />
                  </div>
                ) : selectedMemory.content.transformedContent ? (
                  <>
                    <div className="text-lg font-semibold">ポジティブ変換</div>
                    <div>{selectedMemory.content.transformedContent}</div>
                  </>
                ) : (
                  <div className="flex justify-center">
                    <button
                      className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
                      onClick={onTransform}
                    >
                      ポジティブ変換する
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  作成日:{" "}
                  {selectedMemory.content.createdAt &&
                  !isNaN(new Date(selectedMemory.content.createdAt))
                    ? new Date(selectedMemory.content.createdAt).toLocaleString()
                    : "不明"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
