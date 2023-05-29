import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";

import * as S from "./styles";

export function Home() {
  return (
    <S.Container>
      <HomeHeader />

      <S.Content>
        <CarStatus licensePlate="XXX-1234" />
      </S.Content>
    </S.Container>
  );
}
