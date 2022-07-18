FROM tiangolo/node-frontend:10 AS pre-build

# Docker instructions are stored here
# Use node version 16.15.1
FROM node:16.15.1 AS builder

LABEL maintainer="Le Minh Pham <lmpham1@myseneca.ca>"
LABEL description="UI for Fragments microservice"

# We default to use port 8080 in our service
ENV PORT=3000

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Optimize Node.js apps for production
ENV NODE_ENV production

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Use /app as our working directory
WORKDIR /app

# install app dependencies
#copies package.json and package-lock.json to Docker environment
COPY package*.json /app/

# Installs all node packages

RUN --mount=type=cache,target=/root/.npm,id=npm npm i

# Copies everything over to Docker environment
COPY . /app/

RUN npm run build

#Stage 2
#######################################
#pull the official nginx:latest base image
FROM nginx:latest

COPY --from=builder /app/build /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=pre-build /nginx.conf /etc/nginx/conf.d/default.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 3000