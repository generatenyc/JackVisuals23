export default {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Service",
      type: "string",
      description: "e.g. Event Videography, Brand Campaigns, Drone & Aerial",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order this service appears. Lower numbers appear first.",
    },
  ],
};
