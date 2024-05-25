import "./Dropdown.css";
import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

const DEFAULT_MAX_HEIGHT = 200;

const propTypes = {
  // T[], which means it can be an array of any type
  // the options to be displayed in the dropdown
  options: PropTypes.array,

  // should have a T / T[] type
  // the value of the selected option
  value: PropTypes.any,

  // boolean, flag to indicate if the dropdown is multi-select
  multiSelect: PropTypes.bool,

  // (value: any | any[]) => void
  // the callback function to be called when the selected option changes
  onChange: PropTypes.func,

  // (option: T) => string
  // a function to get the key of the option
  // the key will be displayed in the dropdown
  getKey: PropTypes.func,

  // (option: T) => string
  // a function to get the value of the option
  // the value will be returned when the option is selected
  // A Value should be UNIQUE for each option
  getValue: PropTypes.func,

  // number (default 200) (unit px)
  // the max height of the dropdown menu
  maxHeight: PropTypes.number,

  // boolean (default false)
  // flag to indicate if the dropdown is searchable
  searchable: PropTypes.bool,
};

/**
 * A custom dropdown component.
 *
 * @param {Object} props - The component props.
 * @param {Array<T>} props.options - The options to be displayed in the dropdown.
 * @param {T | T[]} props.value - The value of the selected option(s). T if single select, T[] if multi-select.
 * @param {boolean} props.multiSelect - Flag to indicate if the dropdown is multi-select.
 * @param {(T | T[]) => void} props.onChange - The callback function to be called when the selected option(s) change.
 * @param {(T) => string} props.getKey - A function to get the key of the option.
 * @param {(T) => string} props.getValue - A function to get the value of the option. ASSUMMING VALUE IS UNIQUE
 * @param {number} props.maxHeight - The max height of the dropdown menu. (unit px)
 * @param {boolean} props.searchable - Flag to indicate if the dropdown is searchable.
 * @param {Object} otherProps - The custom props for developer to pass to the dropdown component. like className, style, etc.
 * @returns {JSX.Element} The dropdown component.
 */
const Dropdown = ({
  options = [],
  value,
  multiSelect = false,
  onChange = () => {},
  getKey = (option) => option,
  getValue = (option) => option,
  maxHeight = DEFAULT_MAX_HEIGHT,
  searchable = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    multiSelect ? [] : undefined
  );
  const [searchText, setSearchText] = useState("");

  // when switching between single and multi-select dropdown
  // will clear the selected options
  useEffect(() => {
    setSelectedOptions(multiSelect ? [] : undefined);
  }, [multiSelect]);

  // a memoized function to check if an option is selected
  const isSelected = useMemo(
    () => (selected, option) => {
      if (!selected) return false;
      if (multiSelect)
        return selected.map((opt) => getValue(opt)).includes(getValue(option));
      return getValue(selected) === getValue(option);
    },
    [getValue, multiSelect]
  );

  // set the selected options when the value prop changes
  useEffect(() => {
    if (!value) return;
    setSelectedOptions(value);
  }, [value]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // filter the options based on the search text
  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    return options.filter((option) =>
      getKey(option).toLowerCase().includes(searchText.toLowerCase())
    );
  }, [getKey, options, searchText, searchable]);

  // handle the option click
  const handleOptionClick = (option) => {
    if (!multiSelect) {
      setSelectedOptions(option);
      onChange(option);
      setIsOpen(false);
      return;
    }
    if (selectedOptions.includes(option)) {
      const selected = selectedOptions.filter((o) => o !== option);
      setSelectedOptions(selected);
      onChange(selected);
    } else {
      setSelectedOptions([...selectedOptions, option]);
      onChange([...selectedOptions, option]);
    }
  };

  const handleSelectAll = () => {
    // assuming that user can not sleect all if it is not multi-select
    if (!multiSelect) {
      alert("Select All is only available for multi-select");
      setIsOpen(false);
      return;
    }
    setSelectedOptions(options);
    onChange(options);
    setIsOpen(false);
  };

  const handleDeselectAll = () => {
    const selectValue = multiSelect ? [] : undefined;
    setSelectedOptions(selectValue);
    onChange(selectValue);
    setIsOpen(false);
  };

  // if the dropdown is controlled, use the value prop
  // otherwise, use the selectedOptions state
  const selected = useMemo(() => {
    return value ? value : selectedOptions;
  }, [value, selectedOptions]);

  const handleSearchTextChange = (e) => setSearchText(e.target.value);
  return (
    <div className="dropdown" {...props}>
      <div
        data-testid="dropdown-header"
        className="dropdown-header"
        onClick={toggleDropdown}
      >
        <div data-testid="selected-options" className="selected-options">
          {multiSelect ? (
            <>
              {selected &&
                selected.map((option) => (
                  <div
                    className="selected-option"
                    key={`options-${getKey(option)}`}
                  >
                    {getKey(option)}
                  </div>
                ))}
            </>
          ) : (
            <div> {selected && getKey(selected)} </div>
          )}
        </div>
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {searchable && (
            <div className="dropdown-tools">
              <input
                data-testid="dropdown-search"
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
                  isSelected(selected, option) ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
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
