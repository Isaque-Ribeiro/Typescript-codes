import { RentRepo } from "../../src/Implements/Rentmplements";
import { Rent } from "../../src/Rent";
import crypto from "Cryptography"

export class FakeRentRepo implements RentRepo {
    rents: Rent[] = []

    async add(rent: Rent): Promise<string> {
        const newId = crypto.randomUUID()
        rent.id = newId
        this.rents.push(rent)
        return newId
    }

    async findOpen(bikeId: string, userEmail: string): Promise<Rent> {
        return this.rents.find(rent =>
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            !rent.end
        )
    }

    async findUserRent(email: string): Promise<boolean> {
        return this.rents.find(rent => rent.user.email === email && !rent.end)
    }

    async update(id: string, rent: Rent): Promise<void> {
        const rentIndex = this.rents.findIndex(rent => rent.id === id)
        if (rentIndex !== -1) this.rents[rentIndex] = rent
    }
    
}
