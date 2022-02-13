FROM node:16-alpine3.15

# set working directory
WORKDIR /src

# add `/app/node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH
RUN #mkdir -p node_modules/ && chmod -R 777 node_modules/

COPY package.json ./
COPY package-lock.json ./
RUN npm install -g npm@8.4.1


# add app
COPY . /src
