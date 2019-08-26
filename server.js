require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("./db/models");
// db.sequelize.sync({ force: true });
const express = require("express");
const app = express();

const SenseiTypesRouter = require("./routes/sensei_types");
const UserRouter = require("./routes/user");
const GoalRouter = require("./routes/goal");
const SavingRouter = require("./routes/saving");

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/sensei-types", SenseiTypesRouter);
app.use("/user", UserRouter);
app.use("/goal", GoalRouter);
app.use("/saving", SavingRouter);

app.get("/", function(req, res) {
  res.send("CoyoSan App");
  res.end();
});

db.sequelize
  .sync()
  .then(function() {
    app.listen(app.get("port"), () => {
      console.log("Server Running");
    });
  })
  .catch(function(error) {
    console.error(error);
  });
