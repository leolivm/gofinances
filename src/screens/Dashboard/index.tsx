import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserContainer,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadingContainer,
} from "./styles";
import HighlighCard from "../../components/HighlightCard";
import TransactionCards, {
  TransactionCardProps,
} from "../../components/TransactionCards";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const getLastTransactionDate = (
    collection: DataListProps[],
    type: "positive" | "negative"
  ) => {
    const collectionFiltered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFiltered.length === 0) return 0;

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      { month: "long" }
    )}`;
  };

  const loadTransactions = async () => {
    const response = await AsyncStorage.getItem(
      `@GoFinances:Transactions_User:${user.id}`
    );
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionExpensives = getLastTransactionDate(
      transactions,
      "negative"
    );
    const totalInterval =
      lastTransactionExpensives === 0
        ? "Não há transações."
        : `01 à ${lastTransactionExpensives}`;

    const total = entriesTotal - expensiveTotal;
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastTransactionEntries === 0
            ? "Não há transações"
            : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastTransactionExpensives === 0
            ? "Não há transações."
            : `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.shape} />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserContainer>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />

                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserContainer>
          </Header>

          <HighlightCards>
            <HighlighCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlighCard
              type="down"
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
            />
            <HighlighCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCards data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
