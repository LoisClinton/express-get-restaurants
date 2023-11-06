const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

//TODO: Create your GET Request Route Below:
app.get("/restaurants", async (request, resolve) => {
  const restaurants = await Restaurant.findAll();
  // Send restaurants as converted to a JSON string .
  resolve.json(restaurants);
});

app.get("/restaurants/:id", async (request, resolve) => {
  const id = request.params.id;
  const restaurants = await Restaurant.findByPk(id);
  // Send restaurants as converted to a JSON string .
  resolve.json(restaurants);
});

app.use(express.json());
app.use(express.urlencoded());

// request objects’ body using request.body

app.post("/restaurants", async (request, resolve) => {
  await Restaurant.create({
    name: request.body.name,
    location: request.body.location,
    cuisine: request.body.cuisine,
  });

  const restaurants = await Restaurant.findAll();
  resolve.json(restaurants);
});

app.put("/restaurants/:id", async (request, resolve) => {
  await Restaurant.update(
    {
      name: request.body.name,
      location: request.body.location,
      cuisine: request.body.cuisine,
    },
    {
      where: {
        id: request.params.id,
      },
    }
  );
  const thisRestaurant = await Restaurant.findByPk(request.params.id);
  resolve.json(thisRestaurant);
});

app.delete("/restaurants/:id", async (request, resolve) => {
  await Restaurant.destroy({
    where: {
      id: request.params.id,
    },
  });

  resolve.send("Item deleted");
});

module.exports = app;
