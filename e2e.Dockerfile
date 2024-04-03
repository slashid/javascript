
# Base image
FROM node:20

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Set the working directory
WORKDIR /e2e

# Copy the application files
COPY . .

RUN npm install --force

# Set the entry point for the container
CMD ["npm", "run", "build"]