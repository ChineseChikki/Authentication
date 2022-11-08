//THE HTTP VERBS GET, POST, PUT AND DELETE ARE ROUTES
//WE IMPORT OUR NEEDED MODULES HERE
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//(TWO BAD GUYS/ BODY PARSER MIDDLEWARE)
app.use(express.json()); //ALLOWS FOR JSON FORMAT(IN POSTMAN)
app.use(express.urlencoded({ extended: true })); //ALLOWS FOR FORM FORMAT(IN POSTMAN)

// DESTRUCTURING OF OBJECTS
const { authMiddleware } = require("./MiddleWare/authMiddleWare");

const {
  getUsers,
  createUser,
  userLogin,
  updateUser,
  userUpdate,
  usersUpdate,
  deleteUser,
} = require("./program");

//GETTING ALL USERS / ADMINS FROM OUR DATABASE(FETCH THE DATA)
app.get("/users", getUsers);
// app.get("/admins", getAllUsers);

//CREATING ALL USERS / ADMINS AND STORING THEIR DATA IN OUR DATABASE(PUSH THE DATA)
app.post("/auth/signup", createUser);
app.post("/auth/login", userLogin);
// app.post("/admin", createUserHandler);

//  UPDATING USER INFO(updated)
app.put("/users/update", updateUser);
app.put("/users/updated", authMiddleware, userUpdate);
app.put("/users/updating", authMiddleware, usersUpdate);

//DELETING A USER(DELETE THE DATA)
app.delete("/delete", deleteUser);

//STARTING UP OUR SERVER AT PORT 7000
app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
