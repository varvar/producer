const cron = require('node-cron');
const express = require('express');
const redis = require('redis');
const uuid = require('uuid');
const client = redis.createClient(process.env.DB_PORT, process.env.DB_HOST, {
  no_ready_check: true,
});

client.auth(process.env.DB_PASS, function (err) {
  if (err) throw new Error(err);
});

client.on('error', function (err) {
  console.log('Error ' + err);
});

client.on('connect', function () {
  console.log('Connected to Redis');
});

app = express();

cron.schedule('* * * * *', function () {
  console.log('---------------------');
  const points = [
    {
      id: uuid.v1(),
      location: {
        lat: Math.random() + 32,
        lng: Math.random() + 32,
      },
    },
  ];
  client.publish('points', JSON.stringify(points));
  console.log('Pushed to Redis');
});

app.listen('3128');
