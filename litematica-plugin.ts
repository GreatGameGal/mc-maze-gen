import { plugin } from "bun";
import { parseLitematic } from "./litematica-utils";

plugin({
  name: "litematica-loader",
  setup (build) {
    build.onLoad({ filter: /\.litematic$/ }, async ({ path }) => {


      return {
        exports: parseLitematic(await Bun.file(path).arrayBuffer()),
        loader: "object",
      };
    });
  },
});
