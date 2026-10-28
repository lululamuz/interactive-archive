
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>
      <h1>Lulu's Interactive Archive</h1>
      <p>Welcome to my personal creative archive!</p>
      <p>Illustrations · Videos · Websites · Interactive Projects</p>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
