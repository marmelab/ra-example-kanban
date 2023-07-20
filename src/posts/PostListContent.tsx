import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDataProvider, useListContext } from "react-admin";
import { useMutation } from "react-query";
import type { Post } from ".";
import { PostsByStatus, getPostsByStatus, statuses } from ".";
import { MyDataProvider } from "../dataProvider";
import { PostColumn } from "./PostColumn";

export const PostListContent = () => {
  const { data: unorderedPosts, isLoading, refetch } = useListContext<Post>();
  const dataProvider = useDataProvider<MyDataProvider>();

  const [postsByStatus, setPostsByStatus] = useState<PostsByStatus>(
    getPostsByStatus([])
  );

  useEffect(() => {
    if (unorderedPosts) {
      const newPostsByStatus = getPostsByStatus(unorderedPosts);
      if (!isEqual(newPostsByStatus, postsByStatus)) {
        setPostsByStatus(newPostsByStatus);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unorderedPosts]);

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

    const sourcePost = postsByStatus[source.droppableId as Post["status"]].find(
      (p) => p.index === source.index
    )!;
    const destinationIndex = destination.index;
    const destinationStatus = destination.droppableId as Post["status"];

    // compute local state change synchronously
    setPostsByStatus(
      updatePostStatusLocal(
        sourcePost,
        destinationIndex,
        destinationStatus,
        postsByStatus
      )
    );

    // trigger the mutation to persist the changes
    mutation.mutateAsync({
      source: sourcePost,
      destination: {
        index: destinationIndex,
        status: destinationStatus,
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

const updatePostStatusLocal = (
  sourcePost: Post,
  destinationIndex: number,
  destinationStatus: Post["status"],
  postsByStatus: PostsByStatus
) => {
  if (sourcePost.status === destinationStatus) {
    // moving deal inside the same column
    const postMovedUp = sourcePost.index > destinationIndex;
    const column = postsByStatus[sourcePost.status];
    column.splice(
      column.findIndex((p) => p.index === sourcePost.index),
      1
    );
    column.splice(
      (column.some((p) => p.index === destinationIndex)
        ? column.findIndex((p) => p.index === destinationIndex)
        : column.length) + (postMovedUp ? 0 : 1),
      0,
      sourcePost
    );
    return {
      ...postsByStatus,
      [destinationStatus]: column,
    };
  } else {
    // moving deal across columns
    const sourceColumn = postsByStatus[sourcePost.status];
    const destinationColumn = postsByStatus[destinationStatus];
    sourceColumn.splice(
      sourceColumn.findIndex((p) => p.index === sourcePost.index),
      1
    );
    destinationColumn.splice(
      destinationColumn.some((p) => p.index === destinationIndex)
        ? destinationColumn.findIndex((p) => p.index === destinationIndex)
        : destinationColumn.length,
      0,
      sourcePost
    );
    return {
      ...postsByStatus,
      [sourcePost.status]: sourceColumn,
      [destinationStatus]: destinationColumn,
    };
  }
};