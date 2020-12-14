#!/bin/bash

if [[ $ENV == "development" || $NODE_ENV == "development" ]]; then
  npm run dev --prefix /usr/src/app
else
  npm start --prefix /usr/src/app;
  npm run pm2 logs --prefix=/usr/src/app
fi
