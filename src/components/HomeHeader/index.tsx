import { TouchableOpacity } from "react-native";
import { Power } from "phosphor-react-native";
import { useUser, useApp } from "@realm/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as S from "./styles";
import theme from "../../theme";

export function HomeHeader() {
  const user = useUser();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  function handleLogOut() {
    app.currentUser?.logOut();
  }

  return (
    <S.Container style={{ paddingTop }}>
      <S.Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj@"
      />
      <S.Greeting>
        <S.Message>Hello,</S.Message>

        <S.Name>{user?.profile.name}</S.Name>
      </S.Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogOut}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </S.Container>
  );
}
