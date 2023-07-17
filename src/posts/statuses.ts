import type { Post } from ".";

export const statuses: Post["status"][] = [
  "draft",
  "to_review",
  "to_be_fixed",
  "to_publish",
  "published",
];

export const statusNames: Record<Post["status"], string> = {
  draft: "Draft",
  to_review: "To Review",
  to_be_fixed: "To Be Fixed",
  to_publish: "To Publish",
  published: "Published",
};

export const statusChoices = statuses.map((type) => ({
  id: type,
  name: statusNames[type],
}));
