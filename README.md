# total-loss-process [![CircleCI](https://circleci.com/gh/ford-capstone-wayne-state/total-loss-process.svg?style=svg)](https://circleci.com/gh/ford-capstone-wayne-state/total-loss-process)

## Requirements

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

From the project root run, `npm start` to get the environment spun up and running for development.

Once running, the "insurance" application is visible at http://localhost:4200 and the "viewer" application is visible at http://localhost:4201.

To build the project into images and run for production, run `npm run start:prod`.

To teardown the project run `npm run down`.

To view logs for any of the running services, run `docker-compose logs -f <service-name>`. See the [Docker Compose CLI reference](https://docs.docker.com/compose/reference/) for more info on this.
