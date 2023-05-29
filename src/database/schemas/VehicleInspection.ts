import { Realm } from "@realm/react";

export class VehicleInspection extends Realm.Object<VehicleInspection> {
  _id!: Realm.BSON.ObjectId;
  documentId!: string;
  plate!: string;
  chassi!: string;
  brand!: string;
  model!: string;
  uf!: string;
  type!: string;
  species!: string;
  year!: string;
  plateTowTruck!: string;
  driverTowTruck!: string;
  retentionParkName!: string;
  retentionParkAddress!: string;
  driverName!: string;
  driverLicenseOrId!: string;
  driverEmail!: string;
  agentName!: string;
  agentId!: string;
  latitude!: string;
  longitude!: string;
  address!: string;
  date!: Date;
  dateString!: string;
  checkList!: string;
  gallery!: string;
  observations!: string;

  static schema = {
    name: "VehicleInspection",
    properties: {
      _id: "objectId",
      documentId: "string",
      plate: "string",
      chassi: "string",
      brand: "string",
      model: "string",
      uf: "string",
      type: "string",
      species: "string",
      year: "string",
      plateTowTruck: "string",
      driverTowTruck: "string",
      retentionParkName: "string",
      retentionParkAddress: "string",
      driverName: "string",
      driverLicenseOrId: "string",
      driverEmail: "string",
      agentName: "string",
      agentId: "string",
      latitude: "string",
      longitude: "string",
      address: "string",
      date: "date",
      dateString: "string",
      checkList: "string",
      gallery: "string",
      observations: "string",
    },
    primaryKey: "_id",
  };
}
