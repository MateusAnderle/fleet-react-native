import { TextInputProps } from "react-native";
import { useTheme } from "styled-components";
import * as S from "./styles";

type Props = TextInputProps & {
  label: string;
};

export function LicensePlateInput({ label, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <S.Container>
      <S.Label>{label}</S.Label>

      <S.Input
        maxLength={7}
        autoCapitalize="characters"
        placeholderTextColor={COLORS.GRAY_400}
        {...rest}
      />
    </S.Container>
  );
}
