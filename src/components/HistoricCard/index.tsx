import { TouchableOpacityProps } from "react-native";

import * as S from "./styles";
import { Check, ClockClockwise } from "phosphor-react-native";
import { useTheme } from "styled-components/native";

export type HistoricCardProps = {
  id: string;
  licensePlate: string;
  created: string;
  isSync: boolean;
};

type Props = TouchableOpacityProps & {
  data: HistoricCardProps;
};

export function HistoricCard({ data, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <S.Container activeOpacity={0.7} {...rest}>
      <S.Info>
        <S.LicensePlate>{data.licensePlate}</S.LicensePlate>

        <S.Departure>{data.created}</S.Departure>
      </S.Info>

      {data.isSync ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <ClockClockwise size={24} color={COLORS.GRAY_400} />
      )}
    </S.Container>
  );
}
