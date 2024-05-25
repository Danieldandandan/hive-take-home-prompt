import "./App.css";
import Dropdown from "./component/select/Dropdown";
import React from "react";

function App() {
  const longOptions = Array.from({ length: 1000 }, (_, i) => `Option ${i + 1}`);
  return (
    <div>
      <h1> Take Home Prompt From Daniel Chu</h1>
      <div className="display-container">
        <div className="display-box">
          <h3> single select dropdown: </h3>
          <Dropdown
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
            isMultiSelect={true}
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
          <h3> select with object option: </h3>
          <Dropdown
            options={[
              { key: "Option A", value: "A" },
              { key: "Option B", value: "B" },
              { key: "Option C", value: "C" },
              { key: "Option D", value: "D" },
              { key: "Option E", value: "E" },
            ]}
            getKey={(option) => option.key}
            getValue={(option) => option.value}
          />
        </div>
        <div className="display-box">
          <h3> select with 1000 options: </h3>
          <Dropdown options={longOptions} />
        </div>
        <div className="display-box">
          <h3> select with 1000 options and searchable: </h3>
          <Dropdown options={longOptions} searchable={true} maxHeight={300} />
        </div>
      </div>
    </div>
  );
}

export default App;
