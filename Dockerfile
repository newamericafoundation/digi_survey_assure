FROM node:10

# Grab postgres client for image
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Proceed with build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . ./

## Build the frontend
# RUN mkdir frontend && cd frontend && git clone https://github.com/ConsenSys/__NAME__.git . && npm install && npm run build
WORKDIR /usr/src/app/frontend
RUN npm rebuild node-sass && npm install && npm run build

## Build and start the API
WORKDIR /usr/src/app/api

HEALTHCHECK CMD exit 0

RUN npm install
RUN chmod +x db/wait-for-postgres.sh

CMD ["./db/wait-for-postgres.sh"]
