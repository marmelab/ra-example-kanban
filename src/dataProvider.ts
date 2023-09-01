import fakeRestDataProvider from "ra-data-fakerest";
import { DataProvider } from "react-admin";
import data from "./data.json";
import { Post, getPostsByStatus } from "./posts";

const baseDataProvider = fakeRestDataProvider(data, true);

export interface MyDataProvider extends DataProvider {
  updatePostStatus: (
    // eslint-disable-next-line no-unused-vars
    source: Post,
    // eslint-disable-next-line no-unused-vars
    destination: {
      status: Post["status"];
      index?: number; // undefined if dropped after the last item
    }
  ) => Promise<void>;
}

export const dataProvider: MyDataProvider = {
  ...baseDataProvider,
  updatePostStatus: async (source, destination) => {
    const { data: unorderedPosts } = await dataProvider.getList<Post>("posts", {
      sort: { field: "index", order: "ASC" },
      pagination: { page: 1, perPage: 100 },
      filter: {},
    });

    const postsByStatus = getPostsByStatus(unorderedPosts);

    if (source.status === destination.status) {
      // moving post inside the same column

      const columnPosts = postsByStatus[source.status];
      const destinationIndex = destination.index ?? columnPosts.length + 1;

      if (source.index > destinationIndex) {
        // post moved up, eg
        // dest   src
        //  <------
        // [4, 7, 23, 5]

        await Promise.all([
          // for all posts between destinationIndex and source.index, increase the index
          ...columnPosts
            .filter(
              (post) =>
                post.index >= destinationIndex && post.index < source.index
            )
            .map((post) =>
              dataProvider.update("posts", {
                id: post.id,
                data: { index: post.index + 1 },
                previousData: post,
              })
            ),
          // for the post that was moved, update its index
          dataProvider.update("posts", {
            id: source.id,
            data: { index: destinationIndex },
            previousData: source,
          }),
        ]);
      } else {
        // post moved down, e.g
        // src   dest
        //  ------>
        // [4, 7, 23, 5]

        await Promise.all([
          // for all posts between source.index and destinationIndex, decrease the index
          ...columnPosts
            .filter(
              (post) =>
                post.index <= destinationIndex && post.index > source.index
            )
            .map((post) =>
              dataProvider.update("posts", {
                id: post.id,
                data: { index: post.index - 1 },
                previousData: post,
              })
            ),
          // for the post that was moved, update its index
          dataProvider.update("posts", {
            id: source.id,
            data: { index: destinationIndex },
            previousData: source,
          }),
        ]);
      }
    } else {
      // moving post across columns

      const sourceColumn = postsByStatus[source.status];
      const destinationColumn = postsByStatus[destination.status];
      const destinationIndex =
        destination.index ?? destinationColumn.length + 1;

      await Promise.all([
        // decrease index on the posts after the source index in the source columns
        ...sourceColumn
          .filter((post) => post.index > source.index)
          .map((post) =>
            dataProvider.update("posts", {
              id: post.id,
              data: { index: post.index - 1 },
              previousData: post,
            })
          ),
        // increase index on the posts after the destination index in the destination columns
        ...destinationColumn
          .filter((post) => post.index >= destinationIndex)
          .map((post) =>
            dataProvider.update("posts", {
              id: post.id,
              data: { index: post.index + 1 },
              previousData: post,
            })
          ),
        // change the dragged post to take the destination index and column
        dataProvider.update("posts", {
          id: source.id,
          data: {
            index: destinationIndex,
            status: destination.status,
          },
          previousData: source,
        }),
      ]);
    }
  },
};
