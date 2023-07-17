import { Box, Card, CardContent, CardActions, Typography } from "@mui/material";

import type { Post } from ".";
import { ShowButton } from "react-admin";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Box sx={{ marginBottom: 1 }}>
      <Card>
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
  );
};
