import { Realm, createRealmContext } from "@realm/react";
import { VehicleInspection } from "./schemas/VehicleInspection";
import { Accessory } from "./schemas/Accessory";
import { Damage } from "./schemas/Damage";
import { RetentionPark } from "./schemas/RetentionPark";
import { Species } from "./schemas/Species";
import { VehicleType } from "./schemas/VehicleType";

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately,
};

export const syncConfig: any = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
  existingRealmFileBehavior: realmAccessBehavior,
  onError: (_: any, error: any) => {
    console.log(error);
  },
};

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [
      VehicleInspection,
      Accessory,
      Damage,
      RetentionPark,
      Species,
      VehicleType,
    ],
  });
