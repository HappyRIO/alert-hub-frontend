import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Render (and similar) require listening on all interfaces and the platform $PORT.
  preview: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    strictPort: true,
    // Vite host check: allow any Render Web Service hostname (*.onrender.com).
    allowedHosts: [".onrender.com"],
  },
  plugins: [
    tanstackStart(),
    nitro({
      preset: "vercel",
      // SSR chunks emit `import "tslib"`; Vercel's lambda bundle often has no node_modules for it.
      // Inlining avoids ERR_MODULE_NOT_FOUND at cold start.
      noExternals: ["tslib"],
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
