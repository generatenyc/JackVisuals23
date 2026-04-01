export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "description", title: "Description", type: "text" },
    { name: "vimeoUrl", title: "Vimeo URL", type: "url" },
    {
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;
          const client = context.getClient({ apiVersion: "2024-01-01" });
          const id = context.document._id.replace(/^drafts\./, "");
          const count = await client.fetch(
            `count(*[_type == "project" && featured == true && !(_id in [$current, "drafts." + $current])])`,
            { current: id }
          );
          if (count >= 3) {
            return "There are already 3 featured projects. Un-feature another project first.";
          }
          return true;
        }),
    },
    { name: "date", title: "Date", type: "date" },
    { name: "category", title: "Category", type: "string" },
  ],
};
