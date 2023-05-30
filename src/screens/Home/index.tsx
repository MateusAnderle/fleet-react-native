import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

import { useQuery } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";

import * as S from "./styles";

export function Home() {
  const { navigate } = useNavigation();

  const historic = useQuery(Historic);

  function handleRegisterMoviment() {
    navigate("departure");
  }

  function fetchVehicle() {
    console.log(historic);
  }

  useEffect(() => {
    fetchVehicle();
  }, []);

  return (
    <S.Container>
      <HomeHeader />

      <S.Content>
        <CarStatus licensePlate="XXX-1234" onPress={handleRegisterMoviment} />
      </S.Content>
    </S.Container>
  );
}
