import "./App.css";
import Dropdown from "./component/dropdown/Dropdown";
import React from "react";

const longOptions = Array.from({ length: 1000 }, (_, i) => `Option ${i + 1}`);

const objOptions = [
  { key: "Option A", value: "A" },
  { key: "Option B", value: "B" },
  { key: "Option C", value: "C" },
  { key: "Option D", value: "D" },
  { key: "Option E", value: "E" },
];
function App() {
  const [singleSelectValue, setSingleSelectValue] = React.useState();
  const [multipleSelectValue, setMultipleSelectValue] = React.useState([
    "Option A",
  ]);
  const [selectValue, setSelectValue] = React.useState(objOptions[0]);
  return (
    <div>
      <h1> Take Home Prompt From Daniel Chu</h1>
      <div className="display-container">
        <div className="display-box">
          <h3> Basic single select dropdown: </h3>
          <Dropdown
            value={singleSelectValue}
            onChange={(value) => setSingleSelectValue(value)}
            options={[
              "Option 1",
              "Option 2",
              "Option 3",
              "Option 4",
              "Option 5",
            ]}
          />
        </div>
        <div className="display-box">
          <h3> multiple select dropdown: </h3>
          <Dropdown
            multiSelect
            value={multipleSelectValue}
            onChange={(value) => setMultipleSelectValue(value)}
            options={[
              "Option A",
              "Option B",
              "Option C",
              "Option D",
              "Option E",
              "Very very very very very very very very very very very very very very very very long option",
            ]}
          />
        </div>
        <div className="display-box">
          <h3> dropdown with object option: </h3>
          <Dropdown
            value={selectValue}
            onChange={(value) => {
              setSelectValue(value);
              if (value) {
                alert(
                  `Selected: \n key: ${value.key}, \n value: ${value.value}`
                );
                return;
              }
              alert("No option selected");
            }}
            options={objOptions}
            getKey={(option) => option.key}
            getValue={(option) => option.value}
          />
        </div>
        <div className="display-box">
          <h3> dropdown with with 1000 options: </h3>
          <Dropdown options={longOptions} />
        </div>
        <div className="display-box">
          <h3> dropdown with 1000 options and searchable and custom height:</h3>
          <Dropdown
            multiSelect
            options={longOptions}
            searchable={true}
            maxHeight={400}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
