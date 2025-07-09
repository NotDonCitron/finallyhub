FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "start"]