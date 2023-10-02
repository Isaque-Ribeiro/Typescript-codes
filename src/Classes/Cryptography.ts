import {User} from "./User"

export class Crypt{

    cipher(user: User):void {
    var key = user.password;
    var CipherArray = key.split('');
    var k = Math.floor(Math.random()*100);
    user.krand = k;
    for (var i=0; i < CipherArray.length; i++){
      k = k + (i**i + k*i);
      if(k >= 1000){
        k %= 1000;
      }
      CipherArray[i] += k;
    }
    key = CipherArray.join('');
    user.password = key;
  }

  decipher(user: User):void {
    var key = user.password;
    var k = user.krand;
    var DecipherArray = key.split('');
    var i = 0;
    var count = 0;
    if(k){
      while (i < key.length){
        DecipherArray[count] = key[i];
        if(k >= 1000){
          k %= 1000;
        }
        if((k/10) < 1){
          i += 1;
        }
        else if((k/100) < 1){
          i += 2;
        }
        else if((k/1000) < 1){
          i += 3;
        }
        k = k + (count**count + k*count);
        i += 1;
        count += 1;
      }
      key = DecipherArray.join('');
      user.password = key;
    }
  }
}