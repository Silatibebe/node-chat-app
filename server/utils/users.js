
class Users {
     constructor(){
      this.users = [];
     }
     //add
  addUser(id,name,room) {
   var user = {id, name, room};
   this.users.push(user);
   return user;
     }
     
     //removeUser
     removeUser(id){
        var user = this.getUser(id);
        if(user) {
            this.users = this.users.filter((user) =>user.id !== id);
        }
        return user;
     };

     //getUser
     getUser(id){
             return this.users.filter((user) => user.id === id)[0];
     };
     //getUserList
     getUserList(room){
         var users = this.users.filter((user) => user.room ===room);  
        var namesArray = users.map((user) => user.name);    
         return namesArray; 
     };
}

module.exports = {Users};