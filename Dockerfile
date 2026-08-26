FROM node:18.16-alpine

WORKDIR /app

# Install dependencies first so code changes don't bust the npm cache layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .

USER node

# Default to the Discord bot; docker-compose overrides this per service
CMD ["node", "bot/index.js"]
