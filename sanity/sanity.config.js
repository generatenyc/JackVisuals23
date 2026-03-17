import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import project from "./schemas/project";
import service from "./schemas/service";
import trustedBy from "./schemas/trustedBy";

export default defineConfig({
  name: "jack-visuals",
  title: "Jack Visuals",
  projectId: "yqj0dj48",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [project, service, trustedBy],
  },
});
