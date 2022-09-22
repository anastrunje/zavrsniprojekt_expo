import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

const columns = 9;

const ResultScreen = () => {
  // Taking data needed from UploadScreen.jsx
  const route = useRoute();
  const sudokuDigits = route.params.sudokuDigits;

  renderItem = ({ item, index }) => {
    if (item === 0) {
      // Data is made of a list containing numbers 0-9. If the number is 0, that means the Sudoku cell is empty
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
      data={sudokuDigits}
      style={styles.container}
      renderItem={renderItem}
      numColumns={columns}
    />
  );
};

export default ResultScreen;

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
    height: Dimensions.get("window").width / columns,
    borderWidth: 2,
    borderColor: "#000",
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#000",
  },
});
