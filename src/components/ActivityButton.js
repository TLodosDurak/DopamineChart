import React from 'react';

const ActivityButton = ({ label, onClick }) => {
  return (
    <button
      className="bg-blue-500 text-white p-2 m-1 rounded"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ActivityButton;
