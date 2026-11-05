import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The deploy workflow passes --base=/<repo-name>/ on the command line,
// so the base path is not set here. Locally the site runs at "/".
export default defineConfig({
  plugins: [react()],
});
