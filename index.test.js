const Restaurant = require("./models/Restaurant.js");
const { seedRestaurant } = require("./seedData");
const db = require("./db/connection");
const app = require("./src/app.js");
const request = require("supertest");
const {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} = require("@jest/globals");

beforeAll(async () => {
  await db.sync({ force: true });
  await Restaurant.bulkCreate(seedRestaurant);
});
afterAll(async () => await db.sync({ force: true }));

describe("GET /restaurants tests", () => {
  test("GET /restaurants route returns a status code of 200", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.status).toBe(200);
  });

  test("GET /restaurants route returns an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    const testArray = response.body;
    expect(Array.isArray(testArray)).toBe(true);
  });

  test("GET /restaurants returns the correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body.length).toBe(3);
  });

  test("GET /restaurants returns the correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    const testArray = [];
    for (restaurant of response.body) {
      tempObj = {};
      tempObj.name = restaurant.name;
      tempObj.location = restaurant.location;
      tempObj.cuisine = restaurant.cuisine;
      testArray.push(tempObj);
    }
    expect(testArray).toEqual([
      {
        name: "AppleBees",
        location: "Texas",
        cuisine: "FastFood",
      },
      {
        name: "LittleSheep",
        location: "Dallas",
        cuisine: "Hotpot",
      },
      {
        name: "Spice Grill",
        location: "Houston",
        cuisine: "Indian",
      },
    ]);
  });

  test("GET /restaurants/:id request returns the correct data", async () => {
    const response = await request(app).get("/restaurants/2");
    const testObj = {};
    testObj.name = response.body.name;
    testObj.location = response.body.location;
    testObj.cuisine = response.body.cuisine;
    expect(testObj).toEqual({
      name: "LittleSheep",
      location: "Dallas",
      cuisine: "Hotpot",
    });
  });
});

describe("POST /resturants tests", () => {
  test("POST /restaurants request returns the restaurants array has been updated with the new value", async () => {
    const testObj = {};
    const response = await request(app)
      .post("/restaurants")
      .send({ name: "McDonalds", location: "London", cuisine: "fastfood" });
    const responseLength = response.body.length;
    const newValue = response.body[responseLength - 1];
    testObj.name = newValue.name;
    testObj.location = newValue.location;
    testObj.cuisine = newValue.cuisine;

    expect(testObj).toEqual({
      name: "McDonalds",
      location: "London",
      cuisine: "fastfood",
    });
  });
});

describe("PUT /resturants tests", () => {
  test("PUT /restaurants/:id request updates the restaurant array with the provided value", async () => {
    const testObj = {};
    const response = await request(app)
      .put("/restaurants/2")
      .send({ name: "KFC", location: "London", cuisine: "fastfood" });
    testObj.name = response.body.name;
    testObj.location = response.body.location;
    testObj.cuisine = response.body.cuisine;
    expect(testObj).toEqual({
      name: "KFC",
      location: "London",
      cuisine: "fastfood",
    });
  });
});

describe("DELETE /resturants tests", () => {
  test("DELETE /restaurant/:id deletes the restaurant with the provided id from the array.", async () => {
    const response = await request(app).delete("/restaurants/5");
    const deletedRestaurant = await Restaurant.findByPk(5);
    console.log(deletedRestaurant);
    expect(response.body).toEqual({});
    expect(deletedRestaurant).toEqual(null);
  });
});
