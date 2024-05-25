import "./Dropdown.css";
import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

const propTypes = {
  // T[], which means it can be an array of any type
  // the options to be displayed in the dropdown
  options: PropTypes.array,

  // should have a T / T[] type
  // the value of the selected option
  value: PropTypes.any,

  // boolean, flag to indicate if the dropdown is multi-select
  isMultiSelect: PropTypes.bool,

  // (value: T | T[]) => void
  // the callback function to be called when the selected option changes
  onChange: PropTypes.func,

  // (option: T) => string
  // a function to get the key of the option
  // the key will be displayed in the dropdown
  getKey: PropTypes.func,

  // (option: T) => string
  // a function to get the value of the option
  // the value will be returned when the option is selected
  getValue: PropTypes.func,

  // number (default 200) (unit px)
  // the max height of the dropdown menu
  maxHeight: PropTypes.number,

  // boolean (default false)
  // flag to indicate if the dropdown is searchable
  searchable: PropTypes.bool,
};

const Dropdown = ({
  options = [],
  value,
  isMultiSelect = false,
  onChange = () => {},
  getKey = (option) => option,
  getValue = (option) => option,
  maxHeight = 200,
  searchable = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    isMultiSelect ? [] : undefined
  );
  const [searchText, setSearchText] = useState("");

  // when switching between single and multi-select dropdown
  // will clear the selected options.
  useEffect(() => {
    setSelectedOptions(isMultiSelect ? [] : undefined);
  }, [isMultiSelect]);

  useEffect(() => {
    if (!value) return;
    setSelectedOptions(value);
  }, [value]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    return options.filter((option) =>
      getKey(option).toLowerCase().includes(searchText.toLowerCase())
    );
  }, [getKey, options, searchText, searchable]);

  const handleOptionClick = (option) => {
    if (isMultiSelect) {
      const newSelectedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions);
    } else {
      setSelectedOptions([option]);
      onChange(option);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (!isMultiSelect) {
      alert("Select All is only available for multi-select");
      setIsOpen(false);
      return;
    }
    setSelectedOptions(options);
    onChange(options);
    setIsOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedOptions([]);
    onChange([]);
    setIsOpen(false);
  };

  const handleSearchTextChange = (e) => setSearchText(e.target.value);

  return (
    <div className="dropdown" {...props}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="selected-options">
          {selectedOptions &&
            selectedOptions.map((option) => (
              <div
                className="selected-option"
                key={`options-${getValue(option)}`}
              >
                {option}
              </div>
            ))}
        </div>
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {searchable && (
            <div className="dropdown-tools">
              <input
                className="dropdown-search"
                value={searchText}
                placeholder="Please Search..."
                onChange={handleSearchTextChange}
              />
            </div>
          )}
          <div className="dropdown-tools">
            <div className="dropdown-button" onClick={handleSelectAll}>
              Select All
            </div>
            <div className="dropdown-button" onClick={handleDeselectAll}>
              Deselect All
            </div>
          </div>

          <div
            style={{
              maxHeight: `${maxHeight}px`,
              overflowY: "auto",
            }}
          >
            {filteredOptions.map((option) => (
              <div
                key={`option-items-${getValue(option)}`}
                className={`dropdown-item ${
                  selectedOptions && selectedOptions.includes(getValue(option))
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleOptionClick(getValue(option))}
              >
                {getKey(option)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = propTypes;
export default Dropdown;
