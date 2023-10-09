import sinon from "sinon"
import { App } from "../src/NewApp"
import { Bike } from "../src/Bike"
import { User } from "../src/User"
import { BikeNotFoundError } from "../src/Errors/BikeNotFoundError"
import { UnavailableBikeError } from "../src/Errors/UnavailableBikeError"
import { UserNotFoundError } from "../src/Errors/UserNotFoundError"
import { DuplicateUserError } from "../src/Errors/DuplicateUserError"
import { RentNOtFoundError } from "../src/Errors/RentNOtFoundError"
import { RemoveUserError } from "../src/Errors/RemoveUserError"
import { FakeUserRepo } from "./Repositores/UserData"
import { FakeBikeRepo } from "./Repositores/BikeData"
import { FakeRentRepo } from "./Repositores/RentData"
import { UserRepo } from "../src/Implements/Userimplements"
import { BikeRepo } from "../src/Implements/Bikeimplements"
import { RentRepo } from "../src/Implements/Rentimplements"


let userRepo: UserRepo
let bikeRepo: BikeRepo
let rentRepo: RentRepo

describe('App', () => {
    beforeEach(() => {
        userRepo = new FakeUserRepo()
        bikeRepo = new FakeBikeRepo()
        rentRepo = new FakeRentRepo()
    })

    it('should correctly calculate the rent amount', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        await app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        await app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = await app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        await app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)
        await app.moveBikeTo(bike.id, newYork)
        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw an exception when trying to move an unregistered bike', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const newYork = new Location(40.753056, -73.983056)
        await expect(app.moveBikeTo('fake-id', newYork)).rejects.toThrow(BikeNotFoundError)
    })

    it('should correctly handle a bike rent', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        await app.registerBike(bike)
        await app.rentBike(bike.id, user.email)
        const appRentRepo = (app.rentRepo as FakeRentRepo)
        expect(appRentRepo.rents.length).toEqual(1)
        expect(appRentRepo.rents[0].bike.id).toEqual(bike.id)
        expect(appRentRepo.rents[0].user.email).toEqual(user.email)
        expect(bike.available).toBeFalsy()
    })

    it('should throw unavailable bike when trying to rent with an unavailable bike', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        await app.registerBike(bike)
        await app.rentBike(bike.id, user.email)
        await expect(app.rentBike(bike.id, user.email))
            .rejects.toThrow(UnavailableBikeError)
    })

    it('should throw user not found error when user is not found', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        await expect(app.findUser('fake@mail.com'))
            .rejects.toThrow(UserNotFoundError)
    })

    it('should correctly authenticate user', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        await expect(app.authenticate('jose@mail.com', '1234'))
            .resolves.toBeTruthy()
    })

    it('should throw duplicate user error when trying to register a duplicate user', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        await expect(app.registerUser(user)).rejects.toThrow(DuplicateUserError)
    })

    it('should correctly remove registered user', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        await app.removeUser(user.email)
        await expect(app.findUser(user.email))
            .rejects.toThrow(UserNotFoundError)
    })

    it ('should throw user not found error when trying to remove an unregistered user', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        await expect(app.removeUser('fake@mail.com'))
            .rejects.toThrow(UserNotFoundError)
    })

    it ('should correctly register user', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        await expect(app.findUser(user.email))
            .resolves.toEqual(user)
    })

    it ('should throw rent not found error when trying to return a bike not rented', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('jose', 'jose@mail.com', '1234')
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        bike.available = true
        await expect(this.rentRepo.findOpen(bike.id, user.email)).rejects.toThrow(RentNotFoundError)

    )}

    it ('should throw remove user error when trying to remove user who haves a rent', async () => {
        const app = new App(userRepo, bikeRepo, rentRepo)
        const user = new User('jose', 'jose@mail.com', '1234')
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        await expect(this.rentRepo.findUserRent(user.email)).rejects.toThrow(RemoveUserError)
    )}
})
