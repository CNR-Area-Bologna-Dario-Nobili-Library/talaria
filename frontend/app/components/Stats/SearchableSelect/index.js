import React, { useState } from 'react';
import Select from 'react-select';

const SearchableSelect = ({ options, label, placeholder = "Select an option" , onChange, value }) => {
  // const [selectedOption, setSelectedOption] = useState(null);
  const selectedOption = options.find(option => option.value === value) || null;

  // const handleChange = (option) => {
  //   setSelectedOption(option);
  //   onChange(option);
  // };

  return (
    <div>
      <label>{label}</label>
      <Select
        value={selectedOption}
        onChange={onChange}
        options={options} // Options passed as a prop
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchableSelect;