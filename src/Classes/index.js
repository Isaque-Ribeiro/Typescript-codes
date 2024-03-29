import { App } from "./app";
import { Bike } from "./bike";
import { PrismaBikeRepo } from "../../Tests/External_data/PrismaBikeRepo";
import { PrismaRentRepo } from "../../Tests/External_data/PrismaRentRepo";
import { PrismaUserRepo } from "../../Tests/External_data/PrismaUserRepo";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'
import prisma from "../../Tests/External_data/globalizing_prisma"

async function main() {
    await prisma.user.deleteMany({})
    await prisma.bike.deleteMany({})
    await prisma.rent.deleteMany({})
    const clock = sinon.useFakeTimers();
    const userRepo = new PrismaUserRepo()
    const bikeRepo = new PrismaBikeRepo()
    const rentRepo = new PrismaRentRepo()
    const app = new App(userRepo, bikeRepo, rentRepo)
    const user1 = new User('Jose', 'jose@mail.com', '1234')
    await app.registerUser(user1)
    const bike = new Bike('caloi mountainbike', 'mountain bike',
        1234, 1234, 100.0, 'My bike', 5, [])
    const bikeId = await app.registerBike(bike)
    let persistedBike = await bikeRepo.find(bikeId)
    console.log('Bike disponível: ', persistedBike.available)
    await app.rentBike(bikeId, user1.email)
    persistedBike = await bikeRepo.find(bikeId)
    console.log('Bike disponível: ', persistedBike.available)
    clock.tick(1000 * 60 * 60)
    console.log(await app.returnBike(bikeId, user1.email))
    console.log('Bike disponível: ', persistedBike.available)
}

main()
