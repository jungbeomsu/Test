import bcrypt from "bcrypt";

export class Room {
  constructor(name, data) {
    this.id = data["id"];
    this.name = name;
    this.bannedIDs = data["bannedIPs"] || {};
    this.map = data['map'];
    this.adminId = data['adminId'];
    this.creatorId = data['creatorId'];
    this.purposeId = data['purposeId'];
    this.status = data['status'];
    this.setting = data['settings'] || {};
    this.password = data["password"] || "";
    this.hasAccess = data["hasAccess"];
    this.modPassword = data["modPassword"] || "";
  }
  hasPassword(){
    return !!this.password; // undefined 면 false, 값이 있으면 true
  }
  comparePassword(password) {
    if (this.password === "") { // 비밀번호 없으면 바로 통화
      return true;
    } else {
      return password !== undefined && bcrypt.compareSync(password, this.password);
    }
  }
  compareModPassword(modPassword){
     return bcrypt.compareSync(modPassword, this.modPassword)
  }
  isBannedIP(address){
    return !!this.bannedIDs[address]; // undefined => false, defined => true
  }
  isClosed(){
    return this.status === "CLOSED";
  }
  isAdmin(userId){
    return this.adminId == userId;
  }

  isBannedID(userId) {
    //우선 항상 false
    // return false;
    console.log(userId, this.bannedIDs)
    // this.bannedIPs[userId] 가 undefined => 안통과
    // this.bannedIPs[userId] 가 defined이고 !== 'ENTER' => 안통과
    if(this.bannedIDs[userId] === undefined){
      console.log('undefined');
      return true;
    }
    else if(this.bannedIDs[userId] && this.bannedIDs[userId] !== 'ENTER'){
      console.log('NOT ENTER');
      return true;
    }
    return false;
  }
}
