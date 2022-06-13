FROM node:16-alpine3.15

# set working directory
WORKDIR /src

# add `/app/node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
# RUN npm install -g npm@8.6.0

# add app
COPY . /src

RUN yarn cache clean && yarn --update-checksums
RUN yarn && yarn build

