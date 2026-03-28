export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "description", title: "Description", type: "text" },
    {
      name: "vimeoUrl",
      title: "Vimeo URL",
      type: "url",
      description: "Paste your full Vimeo video URL (e.g. https://vimeo.com/123456789)",
    },
    {
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      description:
        "Toggle on to show this project on the homepage. Maximum 3 featured projects allowed.",
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
    {
      name: "date",
      title: "Date",
      type: "date",
      description: "Date of the project or shoot",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      description: "Select a category or type a custom one",
      options: {
        list: [
          { title: "Live Event", value: "Live Event" },
          { title: "Brand", value: "Brand" },
          { title: "Aerial", value: "Aerial" },
          { title: "Commercial", value: "Commercial" },
          { title: "Documentary", value: "Documentary" },
        ],
        layout: "dropdown",
      },
    },
  ],
};
