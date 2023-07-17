import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { useDataProvider, useListContext } from "react-admin";
import { useMutation } from "react-query";
import type { Post } from ".";
import { statuses } from ".";
import { PostColumn } from "./PostColumn";
import { MyDataProvider } from "../dataProvider";

export const PostListContent = () => {
  const { data: unorderedPosts, isLoading, refetch } = useListContext<Post>();
  const dataProvider = useDataProvider<MyDataProvider>();

  const mutation = useMutation<
    void,
    Error,
    {
      source: Parameters<MyDataProvider["updatePostStatus"]>[0];
      destination: Parameters<MyDataProvider["updatePostStatus"]>[1];
    }
  >(
    ({ source, destination }) =>
      dataProvider.updatePostStatus(source, destination),
    { onSettled: () => refetch() }
  );

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
  // order each column by index
  statuses.forEach((status) => {
    postsByStatus[status] = postsByStatus[status].sort(
      (recordA: Post, recordB: Post) => recordA.index - recordB.index
    );
  });

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    mutation.mutateAsync({
      source: postsByStatus[source.droppableId as Post["status"]][source.index],
      destination: {
        index: destination.index,
        status: destination.droppableId as Post["status"],
      },
    });
  };

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
