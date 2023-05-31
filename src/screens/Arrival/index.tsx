import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import * as S from "./styles";

import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { BSON } from "realm";

import { ButtonIcon } from "../../components/ButtonIcon";
import { X } from "phosphor-react-native";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";

import { getLastAsyncTimestamp } from "../../libs/asyncStorage/syncStorage";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const route = useRoute();
  const { id } = route.params as RouteParamProps;
  const realm = useRealm();
  const { goBack } = useNavigation();

  const historic = useObject(Historic, new BSON.UUID(id));

  const title = historic?.status === "departure" ? "Chegada" : "Detalhes";

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() },
    ]);
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    goBack();
  }

  function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Erro",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }

      realm.write(() => {
        historic.status = "arrival";
        historic.updated_at = new Date();
      });

      Alert.alert("Chegada", "Chegada registrada com sucesso.");
      goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registar a chegada do veículo.");
    }
  }

  useEffect(() => {
    getLastAsyncTimestamp().then((lastSync) =>
      setDataNotSynced(historic!.updated_at.getTime() > lastSync)
    );
  }, []);

  return (
    <S.Container>
      <Header title={title} />
      <S.Content>
        <S.Label>Placa do veículo</S.Label>

        <S.LicensePlate>{historic?.license_plate}</S.LicensePlate>

        <S.Label>Finalidade</S.Label>

        <S.Description>{historic?.description}</S.Description>
      </S.Content>
      {historic?.status === "departure" && (
        <S.Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </S.Footer>
      )}
      {dataNotSynced && (
        <S.AsyncMessage>
          Sincronização da{" "}
          {historic?.status === "departure" ? "partida" : "chegada"} pendente
        </S.AsyncMessage>
      )}
    </S.Container>
  );
}
