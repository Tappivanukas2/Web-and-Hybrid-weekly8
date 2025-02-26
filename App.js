import React from "react";
import ShoppingList from "./ShoppingList";
import { View, Text } from "react-native";

function App() {
  return (
    <View>
      <Text style={{fontSize: 24}}>Shopping List App</Text>
      <ShoppingList />
    </View>
  );
}

export default App;