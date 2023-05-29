import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "styled-components/native";
import { forwardRef } from "react";

import * as S from "./styles";

type Props = TextInputProps & {
  label: string;
};

const TextAreaInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme();

    return (
      <S.Container>
        <S.Label>{label}</S.Label>

        <S.Input
          ref={ref}
          placeholderTextColor={COLORS.GRAY_400}
          multiline
          autoCapitalize="sentences"
          {...rest}
        />
      </S.Container>
    );
  }
);

export { TextAreaInput };
