require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("./db/models");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const SenseiTypesRouter = require("./routes/sensei_types");
const UserRouter = require("./routes/user");
const GoalRouter = require("./routes/goal");
const SavingRouter = require("./routes/saving");

app.set("port", process.env.PORT || 3000);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/sensei-types", SenseiTypesRouter);
app.use("/user", UserRouter);
app.use("/goal", GoalRouter);
app.use("/saving", SavingRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
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
