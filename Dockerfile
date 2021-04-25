FROM node:current-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
COPY ./node_modules ./node_modules

# Bundle app source
COPY dist ./

# Start me!
CMD node index.js --token $TOKEN