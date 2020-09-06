import Mongo from "./base/Mongo";
import { Database } from "./base/Database";


type TemperatureT = {
    id?: string;
    unit_id: string;
    temperature: number;
    timestamp: number;
};

const COLLECTION = "temperatures";

class Temperature extends Mongo {
    constructor(database: Database, private product?: TemperatureT) {
        super(database, COLLECTION, product);
    }

    rules() {
        return {
            unit_id: "required",
            temperature: "required",
        };
    }
}

export default Temperature;
