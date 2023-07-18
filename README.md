# ra-example-kanban

This repository contains an example of a Kanban board built with [React Admin](https://marmelab.com/react-admin/) v4.

[React Admin Kanban](https://github.com/marmelab/ra-example-kanban/assets/14542336/3ab5420f-4590-4463-bd2c-d60675f5bd89)

## About

This project was bootstraped with [Create React Admin](https://marmelab.com/react-admin/CreateReactAdmin.html), and uses the [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) library to create the Kanban board and support drag and drop features.

## Installation

Install the application dependencies by running:

```sh
npm install
```

## Development

Start the application in development mode by running:

```sh
npm run dev
```

## Production

Build the application in production mode by running:

```sh
npm run build
```

## DataProvider

The included data provider use [FakeREST](https://github.com/marmelab/fakerest) to simulate a backend.
You'll find a `data.json` file in the `src` directory that includes some fake data for testing purposes.

It includes two resources, posts and comments.
Posts have the following properties: `id`, `title` and `content`.
Comments have the following properties: `id`, `post_id` and `content`.

