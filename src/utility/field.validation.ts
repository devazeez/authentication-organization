export function requiredFields(req: any, res: any, fields: any) {

    const requiredFields = [fields];
  
    for (const field of fields) {
      if (!req.body[field]) {
        return `${field} cannot be empty`;
      }
    }
  }
  