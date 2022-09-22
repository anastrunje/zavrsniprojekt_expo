// import React from 'react';
// import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';

// const data = [
//   { key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' }, { key: 'G' }, { key: 'H' }, { key: 'I' }, { key: 'J' },
//   // { key: 'K' },
//   // { key: 'L' },
// ];

// const formatData = (data, numColumns) => {
//   const numberOfFullRows = Math.floor(data.length / numColumns);

//   let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
//   while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
//     data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
//     numberOfElementsLastRow++;
//   }

//   return data;
// };

// const numColumns = 3;
// export default class App extends React.Component {
//   renderItem = ({ item, index }) => {
//     if (item.empty === true) {
//       return <View style={[styles.item, styles.itemInvisible]} />;
//     }
//     return (
//       <View
//         style={styles.item}
//       >
//         <Text style={styles.itemText}>{item.key}</Text>
//       </View>
//     );
//   };

//   render() {
//     return (
//       <FlatList
//         data={formatData(data, numColumns)}
//         style={styles.container}
//         renderItem={this.renderItem}
//         numColumns={numColumns}
//       />
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginVertical: 20,
//   },
//   item: {
//     backgroundColor: '#4D243D',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     margin: 1,
//     height: Dimensions.get('window').width / numColumns, // approximate a square
//   },
//   itemInvisible: {
//     backgroundColor: 'transparent',
//   },
//   itemText: {
//     color: '#fff',
//   },
// });

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import ButtonCustom from "../components/ButtonCustom";
import { useSelector, useDispatch } from "react-redux";
import {
  setBoard,
  changeBoard,
  validateBoard,
  solveBoard,
  unmounting,
} from "../actions/boardAction";
import { changeLeaderBoard } from "../actions/leaderAction";

export default function Board({ route, navigation }) {
  const { width } = Dimensions.get("window");
  const { board, initBoard, isSolved, loading, error } = useSelector(
    (state) => state.board
  );
  const dispatch = useDispatch();
  const { diff, name, time } = route.params;
  const [timer, setTimer] = useState(time);
  const [initTimer] = useState(time);

  useEffect(() => {
    dispatch(setBoard(diff));
    return () => {
      dispatch(unmounting());
    };
  }, []);

  useEffect(() => {
    // ? timer
    const countDown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }

      if (timer === 0) {
        clearInterval(countDown);
      }
    }, 1000);
    return () => clearInterval(countDown);
  });

  useEffect(() => {
    if (isSolved === "solved") {
      const second = initTimer - timer;
      dispatch(
        changeLeaderBoard({
          name,
          diff,
          second,
        })
      );
      navigation.replace("Finish", {
        name,
        diff,
        second,
      });
    }
  }, [isSolved]);

  const inputChange = (input, row, col) => {
    if (
      input === "" ||
      Number(input.charCodeAt(0)) > 57 ||
      Number(input.charCodeAt(0)) < 48 ||
      isNaN(input)
    ) {
      input = 0;
    }
    if (+input > 9) {
      input = +input[1];
    }
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = +input;
    dispatch(changeBoard(newBoard));
  };

  const validating = () => {
    dispatch(validateBoard(board));
  };

  const solving = () => {
    dispatch(solveBoard(initBoard));
  };

  const secToMin = (seconds) => {
    let minutes = 0;
    if (seconds / 60 > 0) {
      minutes = parseInt(seconds / 60, 10);
      seconds = seconds % 60;
    }
    return ("0" + minutes).slice(-2) + " : " + ("0" + seconds).slice(-2);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>Error!!!!</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/loading.gif")} />
      </View>
    );
  }
  return (
    <ImageBackground
      style={[styles.imgBackground, styles.bgwhite]}
      resizeMode="cover"
      source={require("../../assets/sudowallpaper.jpg")}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={[styles.container, styles.bgwhite, { width: width }]}>
              <Text
                style={[
                  { fontSize: 40, fontWeight: "bold", color: "black" },
                  styles.textshadow,
                ]}
              >
                {diff.toUpperCase()}
              </Text>
              <Text
                style={[
                  {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "black",
                    paddingBottom: 10,
                  },
                  styles.textshadow,
                ]}
              >
                {secToMin(timer)}
              </Text>
              <View
                style={{
                  marginBottom: 10,
                  padding: 6,
                  borderRadius: 10,
                  backgroundColor: "#8b5a2b",
                }}
              >
                {board.map((rows, rowsId) => {
                  const row = rows.map((col, colId) => (
                    <TextInput
                      editable={initBoard[rowsId][colId] > 0 ? false : true}
                      keyboardType="numeric"
                      style={[
                        styles.input,
                        {
                          width: width / 9 - 10,
                          height: width / 9 - 10,
                          borderRightWidth:
                            colId % 3 === 2 && colId !== 8 ? 3 : 1,
                          borderBottomWidth:
                            rowsId % 3 === 2 && rowsId !== 8 ? 3 : 1,
                        },
                      ]}
                      key={colId}
                      onChangeText={(e) =>
                        e.length < 2 ? inputChange(e, rowsId, colId) : ""
                      }
                      value={col === 0 ? "" : col.toString()}
                    />
                  ));
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                      key={rowsId}
                    >
                      {row}
                    </View>
                  );
                })}
              </View>
              <View style={{ flexDirection: "row" }}>
                <ButtonCustom
                  color={"chartreuse"}
                  isDisabled={timer === 0 ? true : false}
                  title="Submit"
                  func={validating}
                />
                <ButtonCustom
                  color={"crimson"}
                  isDisabled={false}
                  title="Solve This"
                  func={solving}
                />
              </View>
              {isSolved === "" ? (
                <Text></Text>
              ) : (
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 20,
                    marginVertical: 10,
                  }}
                >
                  {isSolved === "unsolved" || isSolved === "broken"
                    ? "Not Solved, Please Try Again"
                    : "Solved, Good Job"}
                </Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    textAlign: "center",
    borderColor: "#8b5a2b",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imgBackground: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  bgwhite: {
    backgroundColor: "#FFFFFFa0",
  },
  textshadow: {
    paddingLeft: 30,
    paddingRight: 30,
    textShadowColor: "#585858",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10,
  },
});
