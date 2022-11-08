//HASHING PASSWORD USING BCRYPT
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);

const secretKey = process.env.SECRET_KEY;

//MOCKED/DUMMY DB FOR STORING USER DATA/INFORMATION
const dB = {
  users: [],
};

//FUNCTION TO CREATE ALL USERS
function createUser(req, res) {
  const newUser = req.body;
  const userEmail = dB.users.filter((user) => newUser.email === user.email);
  if (userEmail.length !== 0) {
    res.status(409).send("User already exist");
  } else {
    let password = newUser.password;
    const hash = bcrypt.hashSync(password, salt);
    newUser.password = hash;
    dB.users.push(newUser);
    res.status(201).send("User created");
  }
}

// FUNCTION TO GET USERS  FROM OUR DATABASE
const getUsers = (req, res) => {
  res.status(200).json({ status: "ok", users: dB.users });
};

//LOGIN VALIDATION(POST REQUEST)
const userLogin = (req, res) => {
  let { email, password } = req.body;
  if (email == "" || password == "") {
    res
      .status(404)
      .json({ status: "failed", message: "please enter email or password" });
  } else {
    let userExist = dB.users.filter((user) => user.email === email);
    if (userExist.length == 0) {
      res.status(404).json({ status: "failed", message: "User not found" });
    } else {
      if (bcrypt.compareSync(password, userExist[0].password)) {
        //Assigning a jwt to user
        const token = jwt.sign({ email }, secretKey, {
          expiresIn: "100000ms",
        });
        // "5d"
        res
          .status(200)
          .json({ status: "success", message: "User Login", token });
      } else {
        res.status(404).json({ status: "failed", message: "Oops! wrong user" });
      }
    }
  }
};

// FNX TO UPDATE A USER(PUT REQUEST) FIRST METHOD

function updateUser(req, res) {
  const decoded = jwt.verify(token, secretKey);
  const userToUpdate = dB.users.find((user) => user.email == decoded.email);
  if (userToUpdate.length == 0) {
    res.status(401).json({ status: "failed", msg: "failed to update" });
  } else {
    dB.users.forEach((user) => {
      if (user.email == userToUpdate.email) {
        user.gender = req.body.gender;
      }
    });
  }
  res
    .status(200)
    .json({ status: "success", message: "user updated successfully" });
}

// FNX TO UPDATE A USER INFO(PUT REQUEST) SECOND METHOD
const userUpdate = (req, res) => {
  const decoded = res.locals;

  if (decoded.email) {
    const userIndex = dB.users.findIndex(
      (item) => item.email === decoded.email
    );
    if (userIndex < 0) {
      res.status(401).json({ status: "failed", message: "user not found" });
    } else {
      const updateUser = { ...dB.users[userIndex], ...req.body };
      dB.users[userIndex] = updateUser;
      res.status(200).json({ status: "ok", message: "user updated" });
    }
  }
};

const usersUpdate = (req, res) => {
  const decoded = res.locals;

  if (decoded.email) {
    dB.users.forEach((user) => {
      if (user.email == decoded.email) {
        user.gender = req.body.gender;
      }
    });
    res.status(200).json({ status: "success", message: "user updated" });
  } else {
    res.status(404).json({ status: "Failed", msg: "Failed to update" });
  }
};

//DELETING USER
const deleteUser = (req, res) => {
  //GETS THE AUTH TOKEN FROM THE REQ HEADER
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, secretKey);
    const userToDelete = dB.users.find((user) => user.email == decoded.email);
    if (userToDelete.length == 0) {
      res.status(401).json({ status: "Failed", msg: "No user Found" });
    } else {
      let indexOfUserToDelete = dB.users.findIndex(
        (user) => user == userToDelete
      );
      dB.users.splice(indexOfUserToDelete, 1);
      {
        res.status(200).json({ status: "success", msg: "user deleted" });
      }
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ status: "failed", message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ status: "failed", message: "Token expired" });
    } else {
      res.status(400).json({ status: "failed", message: "Bad request" });
    }
  }
};

module.exports = {
  getUsers,
  createUser,
  userLogin,
  updateUser,
  userUpdate,
  usersUpdate,
  deleteUser,
};

//FOR EVERY CONDITION ALWAYS RESPOND TO THE CLIENT USING THE STATUS CODE, IF NOT YOU WILL RUN INTO INFINITY LOOP
