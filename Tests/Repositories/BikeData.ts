import { Bike } from "../../src/Bike";
import { BikeRepo } from "../../src/Implements/Bikeimplements";
import { Cryptography } from "../../src/Classes/Cryptography"

export class BikeData implements BikeRepo {
    public bikes: Bike[];
    public crypt: Crypto;

    async add(bike: Bike): Promise <string|undefined> {
        if(bike){
            bike.id = crypt.createId()
            this.bikes.push(bike)
            return bike.id
        }
    }

    async find(bikeId: string): Promise <Bike|undefined> {
        const Fbike = this.bikes.find(bike => bike.id === bikeId)
        if(Fbike){
            return Fbike
        }
    }
