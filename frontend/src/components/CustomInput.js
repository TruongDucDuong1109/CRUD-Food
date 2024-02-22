import React from "react";

const CustomInput = (props) => {
  const { type, i_id, i_class, label, name, val,OnCh,OnBl } = props;
  return (
    <div className="form-floating mt-3">
      <input 
      type={type} 
      name={name} 
      value={val} 
      className={`form-control ${i_class}`} 
      id={i_id} 
      placeholder={label}
      onChange={OnCh}
      onBlur={OnBl}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default CustomInput;
