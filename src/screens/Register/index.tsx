import React, { useState } from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";
import InputForm from "../../components/Forms/InputForm";
import Button from "../../components/Forms/Button";
import TransactionTypeButton from "../../components/Forms/TransactionTypeButton";
import CategorySelectButton from "../../components/Forms/CategorySelectButton";
import CategorySelect from "../CategorySelect";
import { useAuth } from "../../hooks/auth";

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório."),
  amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo.")
    .required("Valor é obrigatório."),
});

const Register: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>("");
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });
  const navigation = useNavigation();
  const { user } = useAuth();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTransactionsTypeSelect = (type: "positive" | "negative") => {
    setTransactionType(type);
  };

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleRegister = async (form: FormData) => {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação.");
    }

    if (category.key === "category") {
      return Alert.alert("Selecione a categoria.");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(
        `@GoFinances:Transactions_User:${user.id}`
      );
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      await AsyncStorage.setItem(
        `@GoFinances:Transactions_User:${user.id}`,
        JSON.stringify(dataFormatted)
      );

      reset();
      setTransactionType("");
      setCategory({
        key: "",
        name: "Categoria",
      });

      navigation.navigate("Listagem");
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível salvar os dados.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionsTypeSelect("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionsTypeSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Register;
