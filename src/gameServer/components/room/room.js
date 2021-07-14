import bcrypt from "bcrypt";

export class Room {
  constructor(name, data) {
    this.name = name;
    this.bannedIPs = data["bannedIPs"] || {};
    this.map = data['map'];
    this.setting = data['settings'];
    this.password = data["password"];
    this.hasAccess = data["hasAccess"];
    this.closed = data["closed"] === undefined ? false : data["closed"];
    this.modPassword = data["modPassword"];
  }
  hasPassword(){
    return !!this.password; // undefined 면 false, 값이 있으면 true
  }
  comparePassword(password){
    return bcrypt.compareSync(password, this.password);
  }
  compareModPassword(modPassword){
     return bcrypt.compareSync(modPassword, this.modPassword)
  }
  isBannedIP(address){
    return !!this.bannedIPs[address]; // undefined => false, defined => true
  }
  isClosed(){
    return this.closed;
  }
}
