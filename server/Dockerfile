# Use Puppeteer base image with Chromium
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Set correct ownership during copy
COPY --chown=pptruser:pptruser package.json package-lock.json ./

# Install dependencies as pptruser (already default in this image)
RUN npm install

# Copy all source files with correct ownership
COPY --chown=pptruser:pptruser . .

# Expose your backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
