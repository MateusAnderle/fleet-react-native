import { Key, Car } from "phosphor-react-native";
import { TouchableOpacityProps } from "react-native";
import * as S from "./styles";
import { useTheme } from "styled-components";

type Props = TouchableOpacityProps & {
  licensePlate?: string | null;
};

export function CarStatus({ licensePlate = null, ...rest }: Props) {
  const Icon = licensePlate ? Car : Key;
  const message = licensePlate
    ? `Vehicle ${licensePlate} in use. `
    : "No vehicles in use. ";
  const status = licensePlate ? "arrival" : "departure";

  const theme = useTheme();

  return (
    <S.Container {...rest}>
      <S.IconBox>
        <Icon size={52} color={theme.COLORS.BRAND_LIGHT} />
      </S.IconBox>

      <S.Message style={{ textAlignVertical: "center" }}>
        {message}

        <S.TextHighlight>Click here to register the {status}.</S.TextHighlight>
      </S.Message>
    </S.Container>
  );
}
