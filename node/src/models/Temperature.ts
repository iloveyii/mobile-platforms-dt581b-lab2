import Mongo from "./base/Mongo";
import { Database } from "./base/Database";
import { ConditionI } from "../interfaces";

export type TemperatureT = {
  id?: string;
  unit_id: string;
  temperature: number;
  timestamp: number;
};

const COLLECTION = "units";

class Temperature extends Mongo {
  constructor(database: Database, private product?: TemperatureT) {
    super(database, COLLECTION, product);
  }

  rules() {
    return {
      unit_id: "required",
      temperature: "required"
    };
  }

  async readSort(condition?: ConditionI, sort?: any) {
    const db = await this.database.db();
    const collection = await db.collection(this.collection);
    const model = await collection.find(condition?.where).sort(sort).limit(5);
    const arr = await model.toArray();
    if (arr.length > 0) {
      this.setResponse(true, arr);
    } else {
      this.setResponse(false, [
        "No record found with here111 condition " +
          JSON.stringify(condition?.where)
      ]);
    }
    return this;
  }
}

export default Temperature;
