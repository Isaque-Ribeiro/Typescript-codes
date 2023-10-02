import { Bike } from "./Bike";
import { Rent } from "./Rent";
import { User } from "./User";
import { Crypt } from "./Cryptography";
 export class FApp {
    users: User[];
    bikes: Bike[];
    rents: Rent[];
   //register bike
   //remove user
   //rent bike
   //return bike
   //user list
   //rent list
   //bike list
   //user autentication

  crypt = new Crypt();

    findUser(user: User): User | undefined {
        return this.users.find(userS => userS.id === user.id);
    }

    registerUser(user: User): void {
      for (const rUser of this.users) {
          if (rUser.email === user.email) {
              throw new Error('Duplicate user.');
          }
      }
      this.crypt.cipher(user);
      const newid = Math.floor(Math.random()*10000000000); 
      user.id = newid.toString();
      this.users.push(user);
    }

    authenticate(email: string, key: string):void {
    }

    registerBike(bike: Bike): void{
        const newid = Math.floor(Math.random()*10000000000); 
        bike.id = newid.toString()
        this.bikes.push(bike);
    }

    removeUser(user: User):void {
      var cont = 0;
      for (const target of this.users){
        if (target.id === user.id && target.password === user.password){
          const tFound = this.users.splice(cont, 1);
        }
        cont += 1;
      }
      if (cont >= this.users.length){
        console.log("Error: bike not found");
      }
    }

    rentBike(bikeId: string, user: User): void {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) {
            throw new Error('Bike not found.')
        }
        if (bike.available == false) {
            throw new Error('Unavailable bike.')
        }
        const Fuser = this.findUser(user);
        if (!Fuser) {throw new Error('User not found.');}
        bike.available = false;
        const rent = new Rent(bike, user, new Date());
        this.rents.push(rent);
    }


   returnBike(bike: Bike): number | undefined{
      const bikeIndex = this.bikes.findIndex(find => find === bike);
      if (bikeIndex === -1) {
        throw new Error('Rent not found.');
      }
      else{
        this.bikes[bikeIndex].description = 'disp';
        this.bikes[bikeIndex].available = true;
        this.rents[bikeIndex].end = new Date();
        const end = this.rents[bikeIndex].end
        if(end){
          const time = timeUsing(end, this.rents[bikeIndex].start);
          return time*bike.rate;
        }
      }
    }


    userList(users: User[]):void {
      if (users.length > 0){
        for(const listing of this.users){
          console.log(listing)
        }
      }
      else {throw new Error('Users list is empty');}
    }


    bikeList(bike: Bike[]):void{
      if (bike.length >= 0){
        for(const listing of this.bikes){
          console.log(listing);
        }
      }
      else {throw new Error('Rents list is empty');}
    }

    bikeMoving(bike: Bike, latitude: number, longitude: number):void {
      if (bike.available){
        const object = this.bikes.find(find => find === bike);
        if(object){
          object.position = [latitude, longitude];
        }      
      }
      else {throw new Error('Bike is not moving');}
    }
  
}

function timeUsing(start: Date, end: Date) {
  var d = (end.getTime() - start.getTime())/1000;
  d /= (60 * 60);
  return Math.abs(d);
}
