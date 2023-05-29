import { Realm } from "@realm/react";

export class RetentionPark extends Realm.Object<RetentionPark> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  address!: string;

  static schema = {
    name: "RetentionPark",
    properties: {
      _id: "objectId",
      name: "string",
      address: "string",
    },
    primaryKey: "_id",
  };
}
