import { Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";

import { ShowButton } from "react-admin";
import type { Post } from ".";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Draggable draggableId={String(post.id)} index={post.index}>
      {(provided, snapshot) => (
        <Box
          sx={{ marginBottom: 1 }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card
            style={{
              opacity: snapshot.isDragging ? 0.9 : 1,
              transform: snapshot.isDragging ? "rotate(-2deg)" : "",
            }}
            elevation={snapshot.isDragging ? 3 : 1}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2">{post.content}</Typography>
            </CardContent>
            <CardActions>
              <ShowButton resource="posts" record={post} />
            </CardActions>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};
