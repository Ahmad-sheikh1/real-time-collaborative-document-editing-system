# Step 1: Use official Node.js as the base image
FROM node:18 AS dev

# Step 2: Set working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Rebuild bcrypt inside the Docker environment
# RUN npm rebuild bcrypt --build-from-source

# Step 6: Expose port 5000 for the Node.js app
EXPOSE 5000

# Step 7: Command to run the Node.js app in development
CMD ["npm", "start"]