import { useNavigation } from "@react-navigation/native";

import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";

import * as S from "./styles";

export function Home() {
  const { navigate } = useNavigation();

  function handleRegisterMoviment() {
    navigate("departure");
  }

  return (
    <S.Container>
      <HomeHeader />

      <S.Content>
        <CarStatus licensePlate="XXX-1234" onPress={handleRegisterMoviment} />
      </S.Content>
    </S.Container>
  );
}
