# Use Ubuntu as the base image
FROM ubuntu:latest

# Update package lists and install Node.js, npm and other dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present) to the container
COPY package*.json process.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Install PM2 globally to manage the application
RUN npm install -g pm2

# Build the NestJS application
RUN npm run build

# Verify the dist directory creation
RUN ls -la /usr/src/app/dist

# Expose the port that your NestJS app will run on (5000)
EXPOSE 5000

# Use PM2 to start the NestJS application with process.json
CMD ["pm2-runtime", "start", "dist/src/main.js"]
