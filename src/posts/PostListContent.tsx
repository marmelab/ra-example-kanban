import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { useListContext } from "react-admin";
import type { Post } from ".";
import { statuses } from ".";
import { PostColumn } from "./PostColumn";

export const PostListContent = () => {
  const { data: unorderedPosts, isLoading } = useListContext<Post>();

  if (isLoading) return null;

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

  const onDragEnd: OnDragEndResponder = async () => {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex">
        {statuses.map((status) => (
          <PostColumn
            status={status}
            posts={postsByStatus[status]}
            key={status}
          />
        ))}
      </Box>
    </DragDropContext>
  );
};
