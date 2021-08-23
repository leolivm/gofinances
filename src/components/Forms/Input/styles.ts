import styled from "styled-components/native";
import { TextInput } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled(TextInput)`
  width: 100%;
  padding: 18px 16px;
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  background-color: ${({ theme }) => theme.colors.inputbackground};
  color: ${({ theme }) => theme.colors.title};
  border-radius: 5px;
  margin-bottom: 8px;

  shadow-opacity: 0.65;
  shadow-radius: 5px;
  shadow-color: black;
  shadow-offset: 0px 0px;
`;
