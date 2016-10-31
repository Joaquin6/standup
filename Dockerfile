from nodesource/trusty:4.4.3

# Define working directory
WORKDIR /src/
ADD . /src

ENV PORT=8080

RUN npm install -g webpack
RUN npm install

# RUN npm run build
# RUN npm start

# Expose port
EXPOSE  8080
