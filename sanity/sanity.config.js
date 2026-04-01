import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import project from "./schemas/project";
import service from "./schemas/service";
import trustedBy from "./schemas/trustedBy";
import productionKit from "./schemas/productionKit";

export default defineConfig({
  name: "jack-visuals",
  title: "Jack Visuals Studio",
  projectId: "yqj0dj48",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("project").title("Project"),
            S.documentTypeListItem("service").title("Service"),
            S.documentTypeListItem("trustedBy").title("Trusted By"),
            S.documentTypeListItem("productionKit").title("Production Kit"),
          ]),
    }),
  ],
  schema: {
    types: [project, service, trustedBy, productionKit],
  },
});
