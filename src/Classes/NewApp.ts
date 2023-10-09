import { Bike } from "./Classes/Bike";
import { Crypt } from "./Cryptography";
import { Rent } from "./Rent";
import { User } from "./User";
import { BikeNotFoundError } from "../Errors/BikeNotFoundError";
import { UnavailableBikeError } from "../Errors/UnavailableBikeError";
import { UserNotFoundError } from "../Errors/UserNotFoundError";
import { DuplicateUserError } from "../Errors/DuplicateUserError";
import { RentNotFoundError } from "../Errors/RentNotFoundError";
import { RentRepo } from "./Implements/Bikeimplements";
import { UserRepo } from "./Implements/Userimplements";
import { BikeRepo } from "./Implements/Rentimplements";

export class App {
    crypt: Crypt = new Crypt()

    constructor(
        readonly userRepo: UserRepo,
        readonly bikeRepo: BikeRepo,
        readonly rentRepo: RentRepo
    ) {}

    async findUser(email: string): Promise<User> {
        const user = await this.userRepo.find(email)
        if (!user) throw new UserNotFoundError()
        return user
    }

    async registerUser(user: User): Promise<string> {
        if (await this.userRepo.find(user.email)) {
          throw new DuplicateUserError()
        }
        this.crypt.cipher(user)
        return await this.userRepo.add(user)
    }

    async authenticate(userEmail: string, password: string): Promise<boolean> {
        const user = await this.findUser(userEmail)
        return await this.crypt.compare(password, user.password)
    }

    async registerBike(bike: Bike): Promise<string> {
        return await this.bikeRepo.add(bike)
    }

    async removeUser(email: string): Promise<void> {
        const Fuser = await this.findUser(email)
        const Frent = this.rentRepo.findUserRent(email)
        if(Frent){
            await this.userRepo.remove(email)
        }    
    }
    
    async rentBike(bikeId: string, userEmail: string): Promise<string> {
        const bike = await this.findBike(bikeId)
        if (!bike.available) {
            throw new UnavailableBikeError()
        }
        const user = await this.findUser(userEmail)
        bike.available = false
        await this.bikeRepo.update(bikeId, bike)
        const newRent = new Rent(bike, user, new Date())
        return await this.rentRepo.add(newRent)
    }

    async returnBike(bikeId: string, userEmail: string): Promise<number> {
        const now = new Date()
        const rent = await this.rentRepo.findOpen(bikeId, userEmail)
        if (!rent){
            throw new RentNotFoundError()
        }
        rent.end = now
        await this.rentRepo.update(rent.id, rent)
        rent.bike.available = true
        await this.bikeRepo.update(rent.bike.id, rent.bike)
        const hours = diffHours(rent.end, rent.start)
        return hours * rent.bike.rate
    }

    async listUsers(): Promise<User[]> {
        return await this.userRepo.list()
    }

    async listBikes(): Promise<Bike[]> {
        return await this.bikeRepo.list()
    }

    async moveBikeTo(bikeId: string, location: Location) {
        const bike = await this.findBike(bikeId)
        bike.location.latitude = location.latitude
        bike.location.longitude = location.longitude
        await this.bikeRepo.update(bikeId, bike)
    }

    async findBike(bikeId: string): Promise<Bike> {
        const bike = await this.bikeRepo.find(bikeId)
        if (!bike) throw new BikeNotFoundError()
        return bike
    }
}
}*/
