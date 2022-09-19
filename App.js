import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

import * as ImagePicker from "expo-image-picker";

import UploadImage from "./screens/UploadImage";

function App() {
  return <UploadImage />;
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

export default App;
