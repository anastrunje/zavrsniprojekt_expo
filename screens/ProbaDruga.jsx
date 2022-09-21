import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { GOOGLE_CLOUD_VISION_API_KEY } from "../secret";
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

async function callGoogleVisionAsync(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "DOCUMENT_TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  console.log("callGoogleVisionAsync -> result", result);

  return result.responses[0].fullTextAnnotation;
}

function ProbaDruga() {
  //The path of the picked image
  const [imageUri, setImageUri] = useState(null);
  const [status, setStatus] = useState(null);

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
      setImageUri(result.uri);
      console.log(result.uri);

      try {
        //Google API code
        const statusResult = await callGoogleVisionAsync(result.base64);
        setStatus(statusResult.text);
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
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

      try {
        //Google API code
        const statusResult = await callGoogleVisionAsync(result.base64);
        setStatus(statusResult.text);
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
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

      <View style={styles.imageContainer}>
        {imageUri !== "" && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
      </View>
      <>{status && <Text style={styles.text}>{status}</Text>}</>
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
});

export default ProbaDruga;
