import { Realm } from "@realm/react";

export class Accessory extends Realm.Object<Accessory> {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static schema = {
    name: "Accessory",
    properties: {
      _id: "objectId",
      name: "string",
    },
    primaryKey: "_id",
  };
}
