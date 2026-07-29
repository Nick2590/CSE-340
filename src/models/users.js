import bcrypt from 'bcrypt';
import { query } from './dg.js';

const findUserByEmail = async (email) => {
  const sql = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      r.role_name
    FROM users AS u
    JOIN roles AS r
      ON u.role_id = r.role_id
    WHERE u.email = $1;
  `;

  const result = await query(sql, [email]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const verifyPassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash);

const createUser = async (name, email, passwordHash) => {
  const sql = `
    INSERT INTO users (
      name,
      email,
      password_hash,
      role_id
    )
    SELECT $1, $2, $3, role_id
    FROM roles
    WHERE role_name = 'user'
    RETURNING user_id, name, email, role_id, created_at;
  `;

  const result = await query(sql, [name, email, passwordHash]);

  if (result.rows.length === 0) {
    throw new Error('Default user role not found');
  }

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const {
    password_hash,
    ...publicUser
  } = user;

  return publicUser;
};

const authenticateUser = async (email, password) => {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, user.password_hash);

  if (!passwordMatches) {
    return null;
  }

  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const getAllUsers = async () => {
  const sql = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      r.role_name
    FROM users AS u
    JOIN roles AS r
      ON u.role_id = r.role_id
    ORDER BY u.name, u.email;
  `;

  const result = await query(sql);
  return result.rows;
};

export { createUser, getUserByEmail, authenticateUser, getAllUsers };