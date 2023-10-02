import { Bike } from "./Bike";
import { User } from "./User";

export class Rent {
    public end: Date | undefined;

    constructor(
        public bike: Bike,
        public user: User,
        public start: Date,
        public id?: string
    ) {}
}