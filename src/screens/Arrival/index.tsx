import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import * as S from "./styles";

import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { BSON } from "realm";

import { ButtonIcon } from "../../components/ButtonIcon";
import { X } from "phosphor-react-native";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { Loading } from "../../components/Loading";

import { getLastAsyncTimestamp } from "../../libs/asyncStorage/syncStorage";
import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { LatLng } from "react-native-maps";

import { Map } from "../../components/Map";
import { Locations } from "../../components/Locations";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { LocationInfoProps } from "../../components/LocationInfo";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const { id } = route.params as RouteParamProps;
  const realm = useRealm();
  const { goBack } = useNavigation();

  const historic = useObject(Historic, new BSON.UUID(id));

  const title = historic?.status === "departure" ? "Arrival" : "Details";

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancel", "Cancel vehicle usage?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => removeVehicleUsage() },
    ]);
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "ErroR",
          "It was not possible to obtain the data to register the vehicle's arrival."
        );
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        historic.status = "arrival";
        historic.updated_at = new Date();
        historic.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert("Arrival", "Arrival successfully registered.");
      goBack();
    } catch (error) {
      Alert.alert("Error", "Vehicle arrival could not be registered.");
    }
  }

  async function getLocationsInfo() {
    if (!historic) {
      return;
    }

    const lastSync = await getLastAsyncTimestamp();
    const updatedAt = historic!.updated_at.getTime();
    setDataNotSynced(updatedAt > lastSync);

    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(historic?.coords ?? []);
    }

    if (historic?.coords[0]) {
      const departureStreetName = await getAddressLocation(historic?.coords[0]);

      setDeparture({
        label: `Departing from ${departureStreetName ?? ""}`,
        description: dayjs(new Date(historic?.coords[0].timestamp)).format(
          "DD/MM/YYYY [at] HH:mm"
        ),
      });
    }

    if (historic?.status === "arrival") {
      const lastLocation = historic.coords[historic.coords.length - 1];
      const arrivalStreetName = await getAddressLocation(lastLocation);

      setArrival({
        label: `Arriving at ${arrivalStreetName ?? ""}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          "DD/MM/YYYY [at] HH:mm"
        ),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <S.Content>
        <Locations departure={departure} arrival={arrival} />

        <S.Label>Vehicle license plate</S.Label>

        <S.LicensePlate>{historic?.license_plate}</S.LicensePlate>

        <S.Label>Purpose</S.Label>

        <S.Description>{historic?.description}</S.Description>
      </S.Content>
      {historic?.status === "departure" && (
        <S.Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Register arrival" onPress={handleArrivalRegister} />
        </S.Footer>
      )}
      {dataNotSynced && (
        <S.AsyncMessage>
          Pending {historic?.status === "departure" ? "departure" : "arrival"}{" "}
          synchronization
        </S.AsyncMessage>
      )}
    </S.Container>
  );
}
