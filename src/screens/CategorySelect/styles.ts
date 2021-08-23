import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import themes from "../../global/styles/themes";

interface CategoryProps {
  isActive: boolean;
}

export const Container = styled(GestureHandlerRootView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Header = styled.View`
  width: 100%;
  height: ${RFValue(113)}px;
  background-color: ${({ theme }) => theme.colors.shape};
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
`;

export const Category = styled.TouchableOpacity<CategoryProps>`
  width: 100%;
  padding: ${RFValue(15)}px;
  flex-direction: row;
  align-items: center;

  background-color: ${({ isActive }) =>
    isActive ? themes.colors.secondary_light : themes.colors.primary};
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.title};
  margin-right: 16px;
`;

export const Name = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
`;

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.text};
`;

export const Footer = styled.View`
  width: 100%;
  padding: 24px;
`;
