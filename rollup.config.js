import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
export default {
  input: "./src/index.js",
  output: {
    name: "Vue",
    format: "umd",
    file: "./dist/vue.js",
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    livereload(),
    serve({
      open: false,
      contentBase: "dist"
    })
  ]
};
