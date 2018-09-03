FROM node:10

EXPOSE 9000
EXPOSE 9229

WORKDIR /rescue_tracks

COPY package.json .

RUN npm i --depth=1

COPY . /rescue_tracks/

CMD ["npm", "run", "start:watch"]
