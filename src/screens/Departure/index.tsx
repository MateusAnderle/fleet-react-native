import { useEffect, useRef, useState } from "react";
import { TextInput, ScrollView, Alert } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useNavigation } from "@react-navigation/native";
import { useUser } from "@realm/react";

import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import {
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords,
} from "expo-location";

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";

import { openSettings } from "../../utils/openSettings";
import { licensePlateValidate } from "../../utils/licensePlateValidate";

import * as S from "./styles";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { Loading } from "../../components/Loading";
import { LocationInfo } from "../../components/LocationInfo";
import { CarSimple } from "phosphor-react-native";
import { Map } from "../../components/Map";
import { startLocationTask } from "../../tasks/backgroundLocationTask";

export function Departure() {
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null);

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const [isRegistering, setIsResgistering] = useState(false);

  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert(
          "Invalid license plate",
          "The license plate is invalid. Please provide the correct plate."
        );
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert(
          "Purpose",
          "Please provide the purpose of vehicle usage"
        );
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          "Location",
          "Unable to retrieve current location. Please try again."
        );
      }

      setIsResgistering(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroundPermissions.granted) {
        setIsResgistering(false);
        return Alert.alert(
          "Location",
          'You need to allow the app to access your location in the background. Please go to your device settings and enable "Allow all the time"',
          [{ text: "Open settings", onPress: openSettings }]
        );
      }

      await startLocationTask();

      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
            coords: [
              {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                timestamp: new Date().getTime(),
              },
            ],
          })
        );
      });

      Alert.alert("Departure", "Vehicle departure successfully registered.");

      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "It was not possible to register the vehicle departure."
      );
      setIsResgistering(false);
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords);
        getAddressLocation(location.coords).then((address) => {
          if (address) {
            setCurrentAddress(address);
          }
        });
      }
    )
      .then((response) => (subscription = response))
      .finally(() => setIsLoadingLocation(false));

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermission?.granted]);

  if (!locationForegroundPermission) {
    return (
      <S.Container>
        <Header title="Departure" />
        <S.MessageContent>
          <S.Message>
            You need to allow the app to access your location to access this
            feature. Please go to your device settings to grant permission to
            the app.
          </S.Message>

          <Button title="Open settings" onPress={openSettings} />
        </S.MessageContent>
      </S.Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Header title="Departure" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}
          <S.Content>
            {currentAddress && (
              <LocationInfo
                icon={CarSimple}
                label="Current location"
                description={currentAddress}
              />
            )}
            <LicensePlateInput
              ref={licensePlateRef}
              label="License plate"
              placeholder="BRA1234"
              onSubmitEditing={() => {
                descriptionRef.current?.focus();
              }}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Purpose"
              placeholder="I will use the vehicle for..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Register Departure"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </S.Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </S.Container>
  );
}
