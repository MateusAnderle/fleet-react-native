import { Key, Car } from "phosphor-react-native";
import * as S from "./styles";
import { useTheme } from "styled-components";

type Props = {
  licensePlate?: string | null;
};

export function CarStatus({ licensePlate = null }: Props) {
  const Icon = licensePlate ? Key : Car;
  const message = licensePlate
    ? `Veículo ${licensePlate} em uso. `
    : "Nenhum veículo em uso. ";
  const status = licensePlate ? "chegada" : "saída";

  const theme = useTheme();

  return (
    <S.Container>
      <S.IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </S.IconBox>

      <S.Message style={{ textAlignVertical: "center" }}>
        {message}

        <S.TextHighlight>
          Clique aqui para registrar a {status}.
        </S.TextHighlight>
      </S.Message>
    </S.Container>
  );
}
