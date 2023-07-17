import { List } from "react-admin";

import { PostListContent } from ".";

export const PostList = () => {
  return (
    <List perPage={100} pagination={false} component="div">
      <PostListContent />
    </List>
  );
};
