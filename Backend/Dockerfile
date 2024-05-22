FROM node:9.6.1

RUN mkdir /gym/src/
WORKDIR /gym/src/

ENV PATH /gym/src//node_modules/.bin:$PATH

COPY package.json /gym/src/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent

CMD ["npm", "start"]