const express = require("express");
const db = require("../db/models");
const jwt = require("jsonwebtoken");
const Router = express.Router();
const senei_health = require("../controlers/sensei_health");

Router.post("/", async function(request, response) {
  const name = request.body.name;
  const price = request.body.price;
  const months = request.body.months;
  if (!name) {
    return response.status(400).send("Mandatory field");
  }
  if (!price) {
    return response.status(400).send("Goal can't be $0.00");
  }
  if (months < 6 || !months) {
    return response.status(400).send("Goal need to be more than six months");
  }
  const token = request.headers.authorization;
  const privateKey = process.env.SECRET_KEY;

  try {
    const decoded = jwt.verify(token, privateKey);
    const newGoal = await db.Goal.create({
      name: name,
      price: price,
      months: months,
      amountToBe: price / months,
      id_user: decoded.id
    });
    response.json(newGoal);
  } catch (error) {
    console.log(error);
    response.status(400).send("Unexpected error");
  }
  response.end();
});

Router.get("/", async function(request, response) {
  try {
    const token = request.headers.authorization;
    const privateKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, privateKey);
    const goal = await db.Goal.findOne({
      where: { id: decoded.id_goal },
      include: [
        {
          model: db.Sensei,
          include: [{ model: db.Sensei_type }, { model: db.Sensei_health }]
        },
        { model: db.Saving }
      ],
      order: [[db.Saving, "createdAt", "DESC"]]
    });
    return response.json(goal);
  } catch {
    response.status(400).send("Unexpected error");
  }
  response.end();
});

Router.get("/update", async function(request, response) {
  try {
    const token = request.headers.authorization;
    const privateKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, privateKey);

    const fristSaving = await db.Saving.findOne({
      where: { id_goal: decoded.id },
      order: [["createdAt", "ASC"]]
    });
    //controller
    //return const result = id of the health calculated
    let result = await senei_health(fristSaving.createdAt, decoded.id_goal);

    const sensei = await db.Sensei.update(
      { id_sensei_health: result },
      { where: { id_goal: decoded.id_goal } }
    );

    const goal = await db.Goal.findOne({
      where: { id: decoded.id_goal },
      include: [
        {
          model: db.Sensei,
          include: [{ model: db.Sensei_type }, { model: db.Sensei_health }]
        },
        { model: db.Saving }
      ],
      order: [[db.Saving, "createdAt", "DESC"]]
    });
    return response.json(goal);
  } catch (error) {
    console.log(error);
    response.status(400).send("Unexpected error");
  }
  response.end();
});

module.exports = Router;
