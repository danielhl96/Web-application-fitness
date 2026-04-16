FROM node:20-alpine as development

WORKDIR /app

# Build tools needed for native addons (socket.io, argon2, etc.)
RUN apk add --no-cache python3 make g++ openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]