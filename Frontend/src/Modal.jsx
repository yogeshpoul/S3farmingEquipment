import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  return (
    < >
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn cursor-pointer" onClick={onClose}>×</span>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
