import React, { useState } from 'react';
import Dashboard from "./Dashboard";
import S3Uploader from "./S3Uploader";
import Modal from "./Modal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={openModal}>Upload Equipment</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <S3Uploader onSuccess={closeModal} />
      </Modal>
      <Dashboard />
    </>
  )
}
