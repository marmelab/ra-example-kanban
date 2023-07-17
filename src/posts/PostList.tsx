import { List } from "react-admin";

import { PostListContent } from ".";

export const PostList = () => {
  return (
    <List
      perPage={100}
      sort={{ field: "index", order: "ASC" }}
      pagination={false}
      component="div"
    >
      <PostListContent />
    </List>
  );
};
