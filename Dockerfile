# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from backend
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend/ .

# Build the TypeScript code
RUN npm run build

# Expose port (Render sets the PORT environment variable automatically)
EXPOSE 5000

# Start the server
CMD [ "npm", "start" ]
