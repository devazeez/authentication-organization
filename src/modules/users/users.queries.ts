export const getUsers = "SELECT * FROM users";

// export const getUserById = "SELECT * FROM users WHERE user_id = $1"
export const getUserById = `
  SELECT u.* 
  FROM users u
  LEFT JOIN user_organizations uo ON u.user_id = uo.user_id
  LEFT JOIN organizations o ON uo.organization_id = o.organization_id
  WHERE u.user_id = $1
    AND (
      o.organization_id IN (
        SELECT o2.organization_id
        FROM organizations o2
        LEFT JOIN user_organizations uo2 ON o2.organization_id = uo2.organization_id
        WHERE uo2.user_id = $2 OR o2.user_id = $2
      )
      OR u.user_id = $2
    );
`;

export const checkEmailExists = " SELECT s FROM users s WHERE s.email = $1";

export const addUser =
  "INSERT INTO users (first_name, last_name, email, password, salt, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, first_name, last_name, email, phone, date_created";

export const loginQuery = "SELECT * FROM users WHERE email = $1";

export const addUserQuery = `
  INSERT INTO users (first_name, last_name, email, password, salt, phone)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING user_id, first_name, last_name, email, phone, date_created
`;
