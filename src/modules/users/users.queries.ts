export const getUsers = "SELECT * FROM users"

export const getUserById = "SELECT * FROM users WHERE user_id = $1"

export const checkEmailExists = " SELECT s FROM users s WHERE s.email = $1"

export const addUser = "INSERT INTO users (first_name, last_name, email, password, salt, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, first_name, last_name, email, phone, date_created" 

export const loginQuery = "SELECT * FROM users WHERE email = $1";

export const addUserQuery = `
  INSERT INTO users (first_name, last_name, email, password, salt, phone)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING user_id, first_name, last_name, email, phone, date_created
`;