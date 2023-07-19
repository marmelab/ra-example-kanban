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

export type PostsByStatus = Record<Post["status"], Post[]>;

export const getPostsByStatus = (unorderedPosts: Post[]) => {
  const postsByStatus: Record<Post["status"], Post[]> = unorderedPosts.reduce(
    (acc, post) => {
      acc[post.status].push(post);
      return acc;
    },
    statuses.reduce(
      (obj, status) => ({ ...obj, [status]: [] }),
      {} as Record<Post["status"], Post[]>
    )
  );
  // order each column by index
  statuses.forEach((status) => {
    postsByStatus[status] = postsByStatus[status].sort(
      (recordA: Post, recordB: Post) => recordA.index - recordB.index
    );
  });
  return postsByStatus;
};