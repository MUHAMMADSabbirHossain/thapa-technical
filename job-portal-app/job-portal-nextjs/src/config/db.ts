import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";

const pool = mysql2.createPool({
  uri: process.env.DATABASE_URL as string,
});

const db = drizzle(pool);

export default db;
