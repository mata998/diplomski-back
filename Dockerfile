FROM node:14
# Create app directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install app dependencies
RUN npm install
# Copy all other files
COPY . .

# Start app
EXPOSE 3000
CMD [ "npm", "start" ]