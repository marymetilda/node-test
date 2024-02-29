const data = require("./db.json");
var cors = require("cors");

const corsOptions = {
  origin: "*",
};

const Joi = require("joi");
const express = require("express");

const app = express();
app.use(cors(corsOptions));

app.get("/", (_, res) => {
  res.send("Welcome hello world");
});

app.get("/api/restaurants", (_, res) => {
  res.send(data.restroData);
});

app.post("/api/restaurants", (req, res) => {
  const { error } = validaterestaurant(req.body);
  if (error) return req.status(400).send(error.details[0].message);

  const restaurant = {
    id: data.restroData.length + 1,
    name: req.body.name,
  };
  data.restroData.push(restaurant);
  res.send(restaurant);
});
app.get("/api/restaurants/:id", (req, res) => {
  const restaurent = data.restroData.find(
    (restaurent) => restaurent.id === req.params.id
  );

  if (!restaurent)
    return res
      .status(404)
      .send("The restaurant with the given restaurant ID was not found");
  res.send(restaurent);
});

app.get("/api/restaurants/menu/:id", (req, res) => {
  const menu = data[req.params.id];

  if (!menu)
    return res
      .status(404)
      .send("The restaurant with the given restaurant ID was not found");
  res.send(menu);
});

// PORT
const port = process.env.PORT || 3000; // Assign custom assignable ports.
// To assign custom ports in terminal you can use keyword export(in windows = set). eg. export PORT=5001

app.listen(port, () => console.log(`Listening the port ${port}...`));

app.put("/api/restaurants/:id", (req, res) => {
  // Look up the restaurant
  // If not existing, return 404
  const restaurant = data.restroData.find(
    (restaurant) => restaurant.id === req.params.id
  );
  if (!restaurant)
    return res
      .status(404)
      .send("The restaurant with the given restaurant ID was not found.");

  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validaterestaurant(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update restaurant
  restaurant.name = req.body.name;

  // Return the updated restaurant
  res.send(restaurant);
});

app.delete("/api/restaurants/:id", (req, res) => {
  const restaurant = data.restroData.find(
    (restaurant) => restaurant.id === req.params.id
  );

  if (!restaurant)
    return res
      .status(404)
      .send("The restaurant with the given restaurant iD was not found");

  const index = data.restroData.indexOf(restaurant);
  data.restroData.splice(index, 1);

  res.send(restaurant);
});

const validaterestaurant = (restaurant) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(restaurant, schema);
};
