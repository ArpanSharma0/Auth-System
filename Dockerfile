# Use the official Node.js 20 Alpine image as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Copy package files first to leverage Docker's cache layering
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the application source code with appropriate ownership
COPY --chown=node:node . .

# Use the non-root 'node' user provided by the base image for security
USER node

# Expose the application port (defaults to 3000 in server.js)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
