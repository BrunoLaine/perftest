FROM node:16.14.2
ENV APIKEY=$APIKEY
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PW=$DB_PW

WORKDIR /usr/src/app
ADD package.json ./
RUN npm install --production
ADD . .
EXPOSE 3001
CMD [ "npm", "start" ]
