import { Box, Typography } from "@mui/material";

import type { Post } from ".";
import { statusNames } from ".";
import { PostCard } from "./PostCard";

export const PostColumn = ({
  status,
  posts,
}: {
  status: Post["status"];
  posts: Post[];
}) => (
  <Box
    sx={{
      flex: 1,
      paddingTop: "8px",
      paddingBottom: "16px",
      bgcolor: "#eaeaee",
      "&:first-child": {
        paddingLeft: "5px",
        borderTopLeftRadius: 5,
      },
      "&:last-child": {
        paddingRight: "5px",
        borderTopRightRadius: 5,
      },
    }}
  >
    <Typography align="center" variant="subtitle1">
      {statusNames[status]}
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 5,
        padding: "5px",
      }}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  </Box>
);
