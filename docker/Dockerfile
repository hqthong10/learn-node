FROM node:18.20.3 as development

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Expose the application port
EXPOSE 3020

CMD [ "npm", "run", "start:dev" ]


# production
FROM node:18.20.3 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/main" ]