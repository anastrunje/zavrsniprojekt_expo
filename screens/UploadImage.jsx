import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

import * as ImagePicker from "expo-image-picker";

function UploadImage() {
  //The path of the picked image
  const [imageUri, setImageUri] = useState("");

  //This function is triggered when the Select an Image button is pressed
  const openGallery = async () => {
    //Ask for permission
    const checkPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (checkPermission.granted === false) {
      alert("Access denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    //Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.uri);
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

    const result = await ImagePicker.launchCameraAsync();

    //Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku Loader</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={openGallery} title="Open Gallery" color={"#87a690"} />
        <Button onPress={openCamera} title="Open Camera" color={"#87a690"} />
      </View>

      <View style={styles.imageContainer}>
        {imageUri !== "" && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
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
});

export default UploadImage;
