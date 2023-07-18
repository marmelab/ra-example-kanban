import { List, SearchInput } from "react-admin";

import { PostListContent } from ".";

const postFilters = [
  // eslint-disable-next-line react/jsx-key
  <SearchInput source="q" alwaysOn />,
];

export const PostList = () => {
  return (
    <List
      filters={postFilters}
      perPage={100}
      sort={{ field: "index", order: "ASC" }}
      pagination={false}
      component="div"
    >
      <PostListContent />
    </List>
  );
};
