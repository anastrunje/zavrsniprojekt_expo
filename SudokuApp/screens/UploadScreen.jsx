import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

function UploadScreen() {
  const [imageUri, setImageUri] = useState(null);

  var sudokuDigits = [];

  const navigation = useNavigation();
  const checkResult = () => {
    navigation.navigate("Results", { sudokuDigits });
  }; //Navigate to digit display

  toServer = async (mediaFile) => {
    //Sends and receives data from backend
    let schema = "http://";
    let host = "192.168.5.13";
    let route = "/image";
    let port = "5000";
    let content_type = "image/jpeg";
    let url = schema + host + ":" + port + route;

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
        sudokuDigits = data;
        console.log("Sudoku digits: ");
        console.log(sudokuDigits);
      })
    );
  };

  const openGallery = async () => {
    //Function for checking permission and picking image from gallery
    const checkPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (checkPermission.granted === false) {
      alert("Access denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });

    console.log(result);

    if (!result.cancelled) {
      //If gallery wasn't closed, set Image uri
      //image size is set, otherwise it won't be sent to backend
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
    }
  };

  const openCamera = async () => {
    //Function for checking permission and taking image from camera
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
      //If camera wasn't closed, set Image uri
      setImageUri(result.uri);
      console.log(result.uri);

      await toServer({
        type: result.type,
        base64: result.base64,
        uri: result.uri,
      });
    } else {
      setImageUri(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Load Sudoku Image from Gallery or Camera
      </Text>
      <View style={styles.buttonContainer}>
        <Button onPress={openGallery} title="Open Gallery" color={"#87a690"} />
        <Button onPress={openCamera} title="Open Camera" color={"#87a690"} />
      </View>

      <View style={styles.buttonCheckResult}>
        <Button onPress={checkResult} title="Check Results" color={"#425247"} />
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
  description: {
    color: "#3d5243",
    fontSize: 20,
    padding: 40,
    fontFamily: "sans-serif-medium",
    fontStyle: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    margin: 5,
  },
  buttonCheckResult: {
    padding: 100,
    width: "100%",
  },
});

export default UploadScreen;
