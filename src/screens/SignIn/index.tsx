import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../hooks/auth";
import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import SignInSocialButton from "../../components/SignInSocialButton";
import { useTheme } from "styled-components";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
  LoadingContainer,
} from "./styles";

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível conectar a conta Google.");
      setIsLoading(false);
    }
  };

  const handleSignInWithApple = async () => {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível conectar a conta Apple.");
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>Controle suas finanças de forma muito simples</Title>
        </TitleWrapper>

        <SignInTitle>Faça seu login com uma das contas abaixo</SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <LoadingContainer color={theme.colors.shape} size="small" />
        )}
      </Footer>
    </Container>
  );
};

export default SignIn;
