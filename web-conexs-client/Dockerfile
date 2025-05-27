#build client
#build api
#copy to runtime

FROM node:18-bullseye-slim as build-web

WORKDIR /client

RUN yes | npm install -g pnpm

RUN apt update 

COPY . .

RUN yes | pnpm install

RUN pnpm vite build

From nginx as host

COPY --from=build-web /client/dist/ /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# change this entrypoint if it is not the same as the repo
ENTRYPOINT ["nginx","-g", "daemon off;"]
