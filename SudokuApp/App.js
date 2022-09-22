import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UploadScreen from "./screens/UploadScreen";
import ResultScreen from "./screens/ResultScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#87a690",
          },
          headerTintColor: "#ebecda",
        }}
      >
        <Stack.Screen name="Home" component={UploadScreen} />
        <Stack.Screen name="Results" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
