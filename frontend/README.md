# Survey Assure Frontend Client

This app is a standard React app built using React Create App.

## Documentation

Comprehensive Survey Assure Documentation can be found [here](https://newamericafoundation.github.io/digi_survey_assure).

# Deployment Options

You can either deploy the frontend as a stand alone app, or you can use the default build which serves it statically from the API. The benefit of using a static deployment strategy is that with PaaS services such as Heroku, you'll only need one deployed app, which reduces costs. If costs aren't a concern, we recommend deploying the frontend separately and invoking a more traditional "Browser Routing" strategy (see below).

# Routing

The frontend uses React Router and comes it the option for two routing styles: Hash vs Browser. By default, the assumption is that the frontend will be served as a static endpoint by the API, therefore the program defaults to "Hash Routing" to avoid 404s.

## Hash Routing vs Browser Routing

- If you are deploying the frontend as a static endpoint served by the API (default), you will need to use "Hash Routing" (default configuration).
  - Hash Routing Example: http://yoursite.com/#/survey/6
- If you intend to deploy the frontend as a stand alone app, we recommend using "Browser Routing".
  - Browser Routing Example: http://yoursite.com/survey/6

To change your strategy:

- Open `src/index.js`
- Change this line: `import { Route, HashRouter as Router } from 'react-router-dom';`
- To this: `import { Route, BrowserRouter as Router } from 'react-router-dom';`

# Configuration

There are two config files: a local development env file and a production env file. Make a copy of both and rename them as follows:

- Local config: `.example.env` -> `.env`
- Production config: `.example.production.env` -> `.env.production`

Local config is used when `npm start` is used, where the production config is used when `npm run build` is used.

# Building the Project

- To build for local development, use `npm start`.
- to build for production release, use `npm run build`.
