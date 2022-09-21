import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button, FlatList } from "react-native";

import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import Environment from "../config/environment";
import firebase from "../config/firebase";
import { Clipboard } from "@react-native-community/clipboard";

function proba() {
  //The path of the picked image
  const [imageUri, setImageUri] = useState("");

  let uploading = false;

  let googleResponse = null;

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
      uploadUrl = await uploadImageAsync(result.uri);
      setImageUri(uploadUrl);
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
      uploadUrl = await uploadImageAsync(result.uri);
      setImageUri(uploadUrl);
      console.log(result.uri);
    }
  };

  _keyExtractor = (item, index) => item.id;

  organize = (array) => {
    return array.map(function (item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  _renderItem = (item) => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  submitToGoogle = async () => {
    try {
      uploading = true;
      let { image } = imageUri;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "LOGO_DETECTION", maxResults: 5 },
              { type: "TEXT_DETECTION", maxResults: 5 },
              { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
              { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
              { type: "IMAGE_PROPERTIES", maxResults: 5 },
              { type: "CROP_HINTS", maxResults: 5 },
              { type: "WEB_DETECTION", maxResults: 5 },
            ],
            image: {
              source: {
                imageUri: image,
              },
            },
          },
        ],
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
          Environment["GOOGLE_CLOUD_VISION_API_KEY"],
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      googleResponse = responseJson;
      uploading = false;
    } catch (error) {
      console.log(error);
    }
  };

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku Loader</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={openGallery} title="Open Gallery" color={"#87a690"} />
        <Button onPress={openCamera} title="Open Camera" color={"#87a690"} />
        {googleResponse && (
          <FlatList
            data={googleResponse.responses[0].labelAnnotations}
            keyExtractor={_keyExtractor}
            renderItem={({ item }) => <Text>Item: {item.description}</Text>}
          />
        )}
      </View>

      <View style={styles.imageContainer}>
        {imageUri !== "" && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
      </View>

      <Button
        style={{ marginBottom: 10 }}
        onPress={() => submitToGoogle()}
        title="Analyze"
      />
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

export default proba;
