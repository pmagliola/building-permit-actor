# Build stage
FROM apify/actor-node:20 AS builder

COPY package*.json tsconfig.json ./
RUN npm install --include=dev

COPY src ./src
RUN ./node_modules/.bin/tsc

# Production stage
FROM apify/actor-node:20

COPY package*.json ./
RUN npm install --omit=dev --omit=optional \
    && echo "Dependencies installed"

COPY --from=builder /usr/src/app/dist ./dist
COPY .actor ./.actor

CMD ["node", "dist/main.js"]
