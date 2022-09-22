import React, { eseEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { withNavigation } from "react-navigation";

const formatData = (data, numOfColumns) => {
  const numberOfFullRows = Math.floor(data.length / numOfColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numOfColumns;
  while (
    numberOfElementsLastRow !== numOfColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const numOfColumns = 9;

const SudokuGame = () => {
  const route = useRoute();
  const sudokuDigits = route.params.sudokuDigits;

  renderItem = ({ item, index }) => {
    if (item === 0) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={formatData(sudokuDigits, numOfColumns)}
      style={styles.container}
      renderItem={renderItem}
      numColumns={numOfColumns}
    />
  );
};

export default SudokuGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: "#ebecda",
  },
  item: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 0,
    height: Dimensions.get("window").width / numOfColumns,
    borderWidth: 2,
    borderColor: "#000", // approximate a square
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#000",
  },
});
