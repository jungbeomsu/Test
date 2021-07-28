import {auth} from "../../../server/constants";

export default class AuthService {
  constructor() {
    this.auth = auth;
  }
  verifyIdToken(token){
    return this.auth.verifyIdToken(token);
  }
}
