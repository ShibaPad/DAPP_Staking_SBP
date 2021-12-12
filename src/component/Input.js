import React from 'react';
import './Input.css';
const Input = ({ onChange, value }) => {
  return (
    <div className="input-box">
      <span className="prefix">Amount&nbsp;&nbsp;| </span>
      <input onChange={onChange} value={value} />
      <span className="suffix">SBP</span>
    </div>
  );
};

export default Input;
