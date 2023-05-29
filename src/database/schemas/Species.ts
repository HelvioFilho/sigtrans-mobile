import { Realm } from "@realm/react";

export class Species extends Realm.Object<Species> {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static schema = {
    name: "Species",
    properties: {
      _id: "objectId",
      name: "string",
    },
    primaryKey: "_id",
  };
}
