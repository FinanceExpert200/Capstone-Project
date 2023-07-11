const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class User {
  static makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      createdAt: user.created_at,
    };
  }

  
  static async login(credentials) {
    // user should submit their email and password
    // if any of these fields are missing, throw an error
    //
    const requriedFields = ["email", "password"];
    requriedFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });

    const user = await User.fetchUserByEmail(credentials.email);

    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return User.makePublicUser(user);
      }
    }

    // lookup the user in the db by email
    // if a user is found, compare the submitted password
    // with the password in the db
    // if there is a match, return the user
    //
    // if any of this goes wrong, throw an error
    throw new UnauthorizedError("Invalid email/password combo");
  }


  static async register(email, firstName, lastName, username, password) {
    // user should submit their email, pw, rsvp status, and number of guests
    // if any of these fields are missing, throw an error
    // const requriedFields = ["email", "firstName", "lastName", "username", "password" ];
    // requriedFields.forEach((field) => {
    //     if (!credentials.hasOwnProperty(field)) {
    //         throw new BadRequestError(`Missing ${field} in request body.`);
    //     }
    // });

    // console.log("In register method");

    if (email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }

    //
    // make sure no user already exists in the system with that email
    // if one does, throw an error
    //

    const existingUser = await User.fetchUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError(`A user already exists with email: ${email}`);
    }
    // take the users password, and hash it
    // take the users email and lowercase it
    //

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const lowercasedEmail = email.toLowerCase();
    // create a new user in the db with all their info
    // return the user
    const result = await db.query(
      `
        INSERT INTO users (
            email,
            first_name,
            last_name,
            username,
            password
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
      [lowercasedEmail, firstName, lastName, username, hashedPassword]
    );
    // return the user
    const user = result.rows[0];
    return user;
  }


  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email.toLowerCase()]);
    const user = result.rows[0];
    return user;
  }
}

module.exports = User;
