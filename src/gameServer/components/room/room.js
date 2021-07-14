import bcrypt from "bcrypt";

export class Room {
  constructor(name, data) {
    this.name = name;
    this.bannedIPs = data["bannedIPs"] || {};
    this.map = data['map'];
    this.setting = data['settings'] || {};
    this.password = data["password"] || "";
    this.hasAccess = data["hasAccess"];
    this.closed = data["closed"] === undefined ? false : data["closed"];
    this.modPassword = data["modPassword"] || "";
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

  isBannedID(userId) {
    //우선 항상 false
    return false;
    console.log(userId, this.bannedIPs)
    // this.bannedIPs[userId] 가 undefined => 안통과
    // this.bannedIPs[userId] 가 defined이고 !== 'ENTER' => 안통과
    if(this.bannedIPs[userId] === undefined){
      console.log('undefined');
      return true;
    }
    else if(this.bannedIPs[userId] && this.bannedIPs[userId] !== 'ENTER'){
      console.log('NOT ENTER');
      return true;
    }
    return false;
  }
}
