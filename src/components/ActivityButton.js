import React from 'react';

const ActivityButton = ({ label, onClick }) => {
  return (
    <button
      className="bg-blue-500 text-white p-2 m-1 rounded hover:bg-blue-900 hover:shadow-md hover:scale-110 transition-all active:shadow-none active:bg-blue-700"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ActivityButton;
