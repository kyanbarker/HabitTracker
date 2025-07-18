FROM node:lts-alpine3.17

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Build the TypeScript application
RUN npm run build

# `npm run start` must be run in a shell to ensure environment variables are loaded correctly,
# hence the use of `sh -c`.
CMD ["sh", "-c", "npm run start"]