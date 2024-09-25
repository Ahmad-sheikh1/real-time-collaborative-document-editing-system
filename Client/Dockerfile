# Step 1: Use official Node.js as the base image
FROM node:18 AS build

# Step 2: Set working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY ./package.json ./package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all project files to the container
COPY . .

# Step 9: Expose port 80
EXPOSE 5173

# Step 10: Start react server
CMD ["npm", "run", "dev", "--", "--host"]
