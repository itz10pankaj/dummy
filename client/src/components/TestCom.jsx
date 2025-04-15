import React, { forwardRef, useImperativeHandle } from 'react';

const TestCom = forwardRef((_, ref) => {
  let parentFunction = null; 

  // Expose methods via useImperativeHandle
  useImperativeHandle(ref, () => ({
    showAlert() {
      alert('Hello from TestCom!');
    },
    setParentFunction(fn) {
      parentFunction = fn; // Set the parent function
    },
  }));

  return (
    <div>
      <p>Hello from TestCom</p>
      <button
        onClick={() => {
          if (parentFunction) {
            parentFunction(); // Call the parent function
          } else {
            console.error('Parent function is not defined!');
          }
        }}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Call Parent Function from TestCom
      </button>
    </div>
  );
});

export default TestCom;