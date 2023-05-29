import { Realm } from "@realm/react";

export class Damage extends Realm.Object<Damage> {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static schema = {
    name: "Damage",
    properties: {
      _id: "objectId",
      name: "string",
    },
    primaryKey: "_id",
  };
}
