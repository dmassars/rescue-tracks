RESCUE TRACKS

1) Install Docker and Docker Compose
2) To build, run `docker-compose build`
  a) NOTE: This assumes you have `rescue-tracks` and `rescue-tracks-frontend` in sibling folders named as such
3) To spin up, run `docker-compose up`
4) If necessary, connect pgAdmin to `localhost:5439` to access the development db.
  a) Username and password are both `postgres`
  b) Create a database named `rescue_tracks`
5) Point browser to `localhost:4200` to start development
  a) Node inspector should be running on 9229
  b) May need to run `docker-compose restart rescue_tracks` to reboot server/inspector

