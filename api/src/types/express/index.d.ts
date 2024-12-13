import { AdvancedResults, User } from "../interfaces"; 

declare global {
  namespace Express {
    interface Response {
      advancedResults?: AdvancedResults;
    }
    interface Request {
      user?: User;
    }
  }
}
