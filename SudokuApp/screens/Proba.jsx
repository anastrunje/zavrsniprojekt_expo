import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
import * as FS from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

function Proba() {
  //The path of the picked image
  const [imageUri, setImageUri] = useState(null);
  const [status, setStatus] = useState(null);
  // const [sudokuDigits, setSudokuDigits] = useState([]);

  var sudokuDigits = [];

  const navigation = useNavigation();
  const goToGame = () => {
    navigation.navigate("SudokuGame", { sudokuDigits });
  };

  toServer = async (mediaFile) => {
    let type = mediaFile.type;
    let schema = "http://";
    let host = "192.168.5.13";
    let route = "/image";
    let port = "5000";
    let url = "";
    let content_type = "image/jpeg";

    url = schema + host + ":" + port + route;

    // let response = await FS.uploadAsync(url, mediaFile.uri, {
    //   headers: {
    //     "content-type": content_type,
    //   },
    //   httpMethod: "GET",
    //   uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    // });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": content_type,
      },
      body: mediaFile,
    }).then((response) =>
      response.json().then((data) => {
        console.log("Data: ");
        console.log(data);
        // setSudokuDigits(data);
        sudokuDigits = data;
        console.log("Sudoku digits: ");
        console.log(sudokuDigits);
      })
    );

    // console.log(response.headers);
    // console.log(response.body);

    // console.log(response);

    // setSudokuDigits(response);

    // axios
    //   .get(url)
    //   .then((response) => setSudokuDigits(response.data))
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // console.log(sudokuDigits);
  };

  //This function is triggered when the Select an Image button is pressed
  const openGallery = async () => {
    //Ask for permission
    const checkPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (checkPermission.granted === false) {
      alert("Access denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });

    //Explore the result
    console.log(result);

    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.localUri || result.uri,
        [{ resize: { height: 500, width: 500 } }],
        { compress: 1, format: SaveFormat.JPEG }
      );
      setImageUri(manipResult);
      console.log(result.uri);
      console.log(manipResult);

      await toServer({
        type: manipResult.type,
        base64: manipResult.base64,
        uri: manipResult.uri,
      });
    } else {
      setImageUri(null);
      setStatus(null);
    }
  };

  //This function is triggered when the Open camera button is pressed
  const openCamera = async () => {
    //Ask for permission
    const checkPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (checkPermission.granted === false) {
      alert("Access denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
    });

    //Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.uri);

      await toServer({
        type: result.type,
        base64: result.base64,
        uri: result.uri,
      });
    } else {
      setImageUri(null);
      setStatus(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku Loader</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={openGallery} title="Open Gallery" color={"#87a690"} />
        <Button onPress={openCamera} title="Open Camera" color={"#87a690"} />
      </View>

      {/* <View style={styles.imageContainer}>
        {imageUri !== "" && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
      </View>
      <>{status && <Text style={styles.text}>{status}</Text>}</> */}

      <View style={styles.startGame}>
        <Button onPress={goToGame} title="Start Game" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ebecda",
  },
  title: {
    color: "#3d5243",
    fontSize: 30,
    padding: 20,
    fontFamily: "sans-serif-medium",
    fontStyle: "bold",
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "cover",
  },
  text: {
    margin: 5,
  },
  startGame: {
    marginBottom: 10,
  },
});

export default Proba;
