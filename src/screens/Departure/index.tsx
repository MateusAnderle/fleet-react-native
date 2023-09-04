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
          "Placa inválida",
          "A placa é inválida. Por favor, informa a placa correta."
        );
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert(
          "Finalidade",
          "Por favor, informe a finalidade da utilização do veículo"
        );
      }

      if(!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert('Localização', 'Não foi possível obter a localização atual. Tente novamente.')
      }

      setIsResgistering(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync()

      if(!backgroundPermissions.granted) {
        setIsResgistering(false)
        return Alert.alert('Localização', 'É necessário permitir que o App tenha acesso localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo."')
      }

      await startLocationTask();

      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });

      Alert.alert("Saída", "Saída do veículo registrada com sucesso.");

      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não possível registrar a saída do veículo.");
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
        <Header title="Saída" />
        <S.Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          acessar essa funcionalidade. Por favor, acesse as configurações do seu
          dispositivo para conceder a permissão ao aplicativo.
        </S.Message>
      </S.Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}
          <S.Content>
            {currentAddress && (
              <LocationInfo
                icon={CarSimple}
                label="Localização atual"
                description={currentAddress}
              />
            )}
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => {
                descriptionRef.current?.focus();
              }}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalizade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </S.Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </S.Container>
  );
}
