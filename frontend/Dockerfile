# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package file
COPY package.json ./

# Install dependencies
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
RUN npm install --legacy-peer-deps

# Copy all app code
COPY . .

# Expose port
EXPOSE 3000

# Run
CMD ["npm", "run", "dev"]
