export const getOrganizations =
  "SELECT * FROM organizations WHERE user_id = $1";

export const getOrganizationById = 'SELECT * FROM user_organizations WHERE organization_id = $1 AND user_id = $2'
// export const getOrganizationById =
//   "SELECT * FROM user_organizations WHERE organization_id = $1 AND user_id = $2";

export const getOrganizationsByUserIdAndOrgId = `
  SELECT 
    o.organization_id, 
    uo.user_id
  FROM 
    user_organizations uo
  JOIN 
    organizations o ON uo.organization_id = o.organization_id
  WHERE 
    uo.user_id = $1 AND uo.organization_id = $2;
`

export const checkEmailExists = "SELECT s FROM users s WHERE s.email = $1";

export const addUser =
  "INSERT INTO users (first_name, last_name, email, password, salt, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, first_name, last_name, email, phone, date_created";

export const addOrgQuery = `
  INSERT INTO organizations (name, description, user_id)
  VALUES ($1, $2, $3)
  RETURNING organization_id, name, description, user_id
`;

export const addUserOrgQuery = `
  INSERT INTO user_organizations (organization_id, user_id)
  VALUES ($1, $2)
  RETURNING organization_id, user_id
`;

export const getUserById = "SELECT * FROM users WHERE user_id = $1";

export const checkUserInOrganization =
  "SELECT * FROM user_organizations WHERE organization_id = $1 AND user_id = $2";

