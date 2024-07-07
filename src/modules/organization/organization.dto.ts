export interface CreateOrgInput {
  name: string;
  description: string;
}

export interface OrgResponse {
  orgId: "string";
  name: "string";
  description: "string";
  dateCreated: "string"
}

export interface addUserToOrgInput{
    userId: "string"
}