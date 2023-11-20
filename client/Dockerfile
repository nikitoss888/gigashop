FROM node:18.9.0-alpine3.16 as development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18.9.0-alpine3.16 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/build /usr/src/app/build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

FROM nginx:latest as production_nginx
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=development /usr/src/app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/src/app
CMD ["nginx", "-g", "daemon off;"]