import { Realm } from "@realm/react";

export class VehicleType extends Realm.Object<VehicleType> {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static schema = {
    name: "VehicleType",
    properties: {
      _id: "objectId",
      name: "string",
    },
    primaryKey: "_id",
  };
}
