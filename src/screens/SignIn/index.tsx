import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Realm, useApp } from "@realm/react";

import * as S from "./styles";

import backgroundImg from "../../assets/background.png";
import { Button } from "../../components/Button";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [_, response, googleSignIng] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  const app = useApp();

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIng().then((response) => {
      if (response?.type !== "success") {
        setIsAuthenticating(false);
      }
    });
  }

  useEffect(() => {
    if (response?.type === "success") {
      if (response.authentication?.idToken) {
        const credentials = Realm.Credentials.jwt(
          response.authentication.idToken
        );

        app.logIn(credentials).catch((error) => {
          console.log(error);
          Alert.alert(
            "Sign in.",
            "It was not possible to connect to your Google account."
          );
          setIsAuthenticating(false);
        });
      } else {
        Alert.alert(
          "Sign in.",
          "It was not possible to connect to your Google account."
        );
        setIsAuthenticating(false);
      }
    }
  }, [response]);

  return (
    <S.Container source={backgroundImg}>
      <S.Title>Ignite Fleet</S.Title>

      <S.Slogan>Vehicle Usage Management</S.Slogan>

      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </S.Container>
  );
}
