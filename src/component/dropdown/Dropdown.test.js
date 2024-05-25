import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Dropdown from "./Dropdown";

const objectOptions = [
  { key: "KEY A", value: "A" },
  { key: "KEY B", value: "B" },
  { key: "Key C", value: "C" },
];

describe("Besic tests", () => {
  afterEach(() => cleanup());
  it("should render with out crashing", async () => {
    render(<Dropdown />);
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("should toggles dropdown on header click", () => {
    render(<Dropdown />);
    const header = screen.getByText("▼");
    fireEvent.click(header);
    expect(screen.getByText("▲")).toBeInTheDocument();
    fireEvent.click(header);
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("should displays the correct number of options when opened", () => {
    render(<Dropdown options={["Option A", "Option B", "Option C"]} />);
    fireEvent.click(screen.getByText("▼"));
    expect(screen.getAllByText(/Option/).length).toBe(3);
  });
  it("should beable to switch selected option", async () => {
    render(<Dropdown options={["Option A", "Option B", "Option C"]} />);
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Option A"));
    const header = await screen.findByTestId("dropdown-header");
    expect(header).toHaveTextContent("Option A");
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Option B"));
    expect(header).toHaveTextContent("Option B");
  });
  it("should works fine when loding a large number of options", async () => {
    render(
      <Dropdown
        options={Array.from({ length: 1000 }, (_, i) => `Option ${i}`)}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    expect(screen.getAllByText(/Option/).length).toBe(1000);
  });
});

describe("single select dropdown test", () => {
  it("should display the dropdown", async () => {
    render(<Dropdown data-testid="dropdown" />);
    const dropdown = await screen.findByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
  });
  it("should be able to display the value", async () => {
    render(<Dropdown data-testid="dropdown" value={"option A"} />);
    const dropdown = await screen.findByTestId("dropdown");
    expect(dropdown).toHaveTextContent("option A");
  });
  it("should be able to trigger the onChange event when selecting", async () => {
    const onChange = jest.fn();
    render(
      <Dropdown
        data-testid="dropdown"
        value={"option A"}
        onChange={onChange}
        options={["Option A", "Option B", "Option C"]}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Option B"));
    expect(onChange).toHaveBeenCalledWith("Option B");
  });
  it("should change the slected options freely when the dropdown in uncontrolled", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        options={["Option A", "Option B", "Option C"]}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Option A"));
    const slected = await screen.findByTestId("selected-options");
    expect(slected).toHaveTextContent("Option A");
  });
  it("should show the key of the selected options", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        value={objectOptions[0]}
        options={objectOptions}
        getKey={(option) => option.key}
        getValue={(option) => option.value}
      />
    );
    const slected = await screen.findByTestId("selected-options");
    expect(slected).toHaveTextContent("KEY A");
  });
  it("should trigger onChange with the selected object", async () => {
    const onChange = jest.fn();
    render(
      <Dropdown
        data-testid="dropdown"
        value={objectOptions[0]}
        onChange={onChange}
        options={objectOptions}
        getKey={(option) => option.key}
        getValue={(option) => option.value}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("KEY B"));
    expect(onChange).toHaveBeenCalledWith({ key: "KEY B", value: "B" });
  });
});

describe("multi select dropdown test", () => {
  it("should display the multiple select dropdown", async () => {
    render(<Dropdown data-testid="dropdown" multiSelect />);
    const dropdown = await screen.findByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
  });
  it("should be able to display the value", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        multiSelect
        value={["Option A", "Option B"]}
      />
    );
    const dropdown = await screen.findByTestId("dropdown");
    expect(dropdown).toHaveTextContent("Option AOption B");
  });
  it("should be able to trigger the onChange event when selecting", async () => {
    const onChange = jest.fn();
    render(
      <Dropdown
        data-testid="dropdown"
        multiSelect
        value={["Option A"]}
        onChange={onChange}
        options={["Option A", "Option B", "Option C"]}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Option B"));
    expect(onChange).toHaveBeenCalledWith(["Option A", "Option B"]);
  });
  it("should change the slected options freely when the dropdown in uncontrolled", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        multiSelect
        options={["Option A", "Option B", "Option C"]}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Option A"));
    fireEvent.click(screen.getByText("Option B"));
    const slected = await screen.findByTestId("selected-options");
    expect(slected).toHaveTextContent("Option AOption B");
  });
  it("should works fine with object when option is object", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        multiSelect
        options={objectOptions}
        getKey={(option) => option.key}
        getValue={(option) => option.value}
      />
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("KEY A"));
    fireEvent.click(screen.getByText("KEY B"));
    const slected = await screen.findByTestId("selected-options");
    expect(slected).toHaveTextContent("KEY AKEY B");
  });
});

describe("feature test: Select all", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should have select all in the dropdown", async () => {
    render(<Dropdown data-testid="dropdown" />);
    const headder = await screen.findByTestId("dropdown-header");
    expect(headder).toBeInTheDocument();
    fireEvent.click(headder);
    const selectAll = await screen.findByText("Select All");
    expect(selectAll).toBeInTheDocument();
  });
  it("should alert when clicking select all in single select dropdown", async () => {
    window.alert = jest.fn();
    render(<Dropdown data-testid="dropdown" />);
    const headder = await screen.findByTestId("dropdown-header");
    fireEvent.click(headder);
    const selectAll = await screen.findByText("Select All");
    fireEvent.click(selectAll);
    expect(window.alert).toHaveBeenCalledWith(
      "Select All is only available for multi-select"
    );
  });
  it("should select all options in multi select dropdown", async () => {
    render(
      <Dropdown multiSelect options={["Option A", "Option B", "Option C"]} />
    );
    const headder = await screen.findByTestId("dropdown-header");
    fireEvent.click(headder);
    const selectAll = await screen.findByText("Select All");
    fireEvent.click(selectAll);
    expect(headder).toHaveTextContent("Option AOption BOption C");
  });
});

describe("feature test: Clear All", () => {
  it("should have select all in the dropdown", async () => {
    render(<Dropdown data-testid="dropdown" />);
    const headder = await screen.findByTestId("dropdown-header");
    expect(headder).toBeInTheDocument();
    fireEvent.click(headder);
    const selectAll = await screen.findByText("Deselect All");
    expect(selectAll).toBeInTheDocument();
  });
  it("should clear the selected item on single select", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        options={["Option A", "Option B", "Option C"]}
      />
    );
    const headder = await screen.findByTestId("dropdown-header");
    fireEvent.click(headder);
    fireEvent.click(screen.getByText("Option A"));
    fireEvent.click(headder);
    const deselectAll = await screen.findByText("Deselect All");
    fireEvent.click(deselectAll);
    const selected = await screen.findByTestId("selected-options");
    expect(selected).toHaveTextContent("");
  });
  it("should clear all options in multi select dropdown", async () => {
    render(
      <Dropdown multiSelect options={["Option A", "Option B", "Option C"]} />
    );
    const headder = await screen.findByTestId("dropdown-header");
    fireEvent.click(headder);
    fireEvent.click(screen.getByText("Option A"));
    fireEvent.click(screen.getByText("Option B"));
    const deSelectAll = await screen.findByText("Deselect All");
    fireEvent.click(deSelectAll);
    const selected = await screen.findByTestId("selected-options");
    expect(selected).toHaveTextContent("");
  });
});

describe("feature test: search", () => {
  it("should have a search input displayed", async () => {
    render(<Dropdown data-testid="dropdown" searchable />);
    const headder = await screen.findByTestId("dropdown-header");
    fireEvent.click(headder);
    const search = await screen.findByTestId("dropdown-search");
    expect(search).toBeInTheDocument();
  });
  it("should filter the options when searching", async () => {
    render(
      <Dropdown
        data-testid="dropdown"
        searchable
        options={["Option A", "Option B", "Option C"]}
      />
    );
    const headder = await screen.findByTestId("dropdown-header");
    fireEvent.click(headder);
    const search = await screen.findByTestId("dropdown-search");
    fireEvent.change(search, { target: { value: "A" } });
    expect(screen.getAllByText(/Option/).length).toBe(1);
  });
});
