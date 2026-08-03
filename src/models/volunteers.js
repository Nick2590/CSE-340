import { query } from './dg.js';

const addVolunteer = async (userId, projectId) => {
  const sql = `
    INSERT INTO user_project (
      user_id,
      project_id
    )
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING user_id, project_id, signed_up_at;
  `;

  const result = await query(sql, [userId, projectId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const removeVolunteer = async (userId, projectId) => {
  const sql = `
    DELETE FROM user_project
    WHERE user_id = $1
      AND project_id = $2
    RETURNING user_id, project_id;
  `;

  const result = await query(sql, [userId, projectId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getVolunteerProjectsByUserId = async (userId) => {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date AS date,
      p.organization_id,
      o.name AS organization_name,
      up.signed_up_at
    FROM user_project AS up
    JOIN project AS p
      ON up.project_id = p.project_id
    JOIN organization AS o
      ON p.organization_id = o.organization_id
    WHERE up.user_id = $1
    ORDER BY p.project_date ASC, p.title;
  `;

  const result = await query(sql, [userId]);
  return result.rows;
};

const isUserVolunteering = async (userId, projectId) => {
  const sql = `
    SELECT 1
    FROM user_project
    WHERE user_id = $1
      AND project_id = $2;
  `;

  const result = await query(sql, [userId, projectId]);
  return result.rows.length > 0;
};

export {
  addVolunteer,
  removeVolunteer,
  getVolunteerProjectsByUserId,
  isUserVolunteering,
};