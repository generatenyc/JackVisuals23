import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "yqj0dj48",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

// All projects — /work page
export const allProjectsQuery = `*[_type == "project"] | order(date desc) {
  ...,
  "resolvedCategory": select(
    defined(customCategory) && customCategory != "" => customCategory,
    category
  )
}`;

// Featured projects — homepage (max 3)
export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(date desc)[0...3] {
  ...,
  "resolvedCategory": select(
    defined(customCategory) && customCategory != "" => customCategory,
    category
  )
}`;

// Services — ordered
export const servicesQuery = `*[_type == "service"] | order(order asc)`;

// Trusted By — ordered
export const trustedByQuery = `*[_type == "trustedBy"] | order(order asc)`;

// Production Kit — singleton
export const productionKitQuery = `*[_type == "productionKit"][0]`;
