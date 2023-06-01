import * as Location from "expo-location";

type LocationProps = {
  longitude: number;
  latitude: number;
};

export async function getPermissions() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("A permissão de localização não foi concedida");
  }
}

export async function getCurrentLocation() {
  let location: Location.LocationObject =
    await Location.getCurrentPositionAsync({});
  return location;
}

export async function getReverseGeocodeAsync(
  location: LocationProps
): Promise<string> {
  let data: Location.LocationGeocodedAddress[] =
    await Location.reverseGeocodeAsync(location);

  return data[0].street
    ? data[0].street
    : "Não foi possível encontrar o endereço";
}
