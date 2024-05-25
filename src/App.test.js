import { render, screen } from "@testing-library/react";
import App from "./App";
test("title is displayed in the screen", async () => {
  render(<App />);
  const title = await screen.findByText("Take Home Prompt From Daniel Chu");
  expect(title).toBeInTheDocument();
});
