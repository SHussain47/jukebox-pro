import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  try {
    const sql = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *
    `;
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [username, hashedPassword];
    const { rows: [user] } = await db.query(sql, values);
    return user;
  } catch (error) {
    console.error("Error with createUser query: ", error);
    throw error;
  }
}

export async function getUserByUsernameAndPassword(username, password) {
  try {
    const sql = `
      SELECT *
      FROM users
      WHERE username = $1
    `;
    const values = [username];
    const { rows: [user] } = await db.query(sql, values);

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
  } catch (error) {
    console.error("Error with getUserByUsernameAndPassword query: ", error);
    throw error;
  }
}
