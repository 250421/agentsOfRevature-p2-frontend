# Build stage
FROM node:18-alpine AS build

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN VITE_API_URL=${VITE_API_URL} pnpm build

# Production stage
FROM node:18-alpine

# Install serve to run the application
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Expose port 8082 (matching backend configuration)
EXPOSE 8082

# Start the application
CMD ["serve", "-s", "dist", "-l", "8082"] 