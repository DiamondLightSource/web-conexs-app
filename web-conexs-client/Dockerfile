#build client
#build api
#copy to runtime

FROM node:23-bookworm-slim as build-web

WORKDIR /client

RUN yes | npm install -g pnpm

RUN apt update 

COPY . .

RUN yes | pnpm install

RUN pnpm vite build

From docker.io/nginxinc/nginx-unprivileged:alpine3.21-slim as host

COPY --from=build-web /client/dist/ /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081
ENTRYPOINT ["nginx","-g", "daemon off;"]
