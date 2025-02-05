import react from "@vitejs/plugin-react"
import rollupNodePolyFill from "rollup-plugin-polyfill-node"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "process.env": {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        VITE_DCL_DEFAULT_ENV: envVariables.VITE_DCL_DEFAULT_ENV,
        VITE_BASE_URL: envVariables.VITE_BASE_URL,
      },
      global: {},
    },
    server: {
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "/auth": {
          target: "https://decentraland.zone",
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
      sourcemap: true,
    },
    ...(command === "build" ? { base: envVariables.VITE_BASE_URL } : undefined),
  }
})
