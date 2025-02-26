import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { FlatList, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    // 🔥 Real-time listener to update list when Firestore changes
    const unsubscribe = onSnapshot(collection(db, "shoppinglist"), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // ✅ Add new item to Firestore and update the UI immediately
  const addItem = async () => {
    if (newItem.trim() === "") {
      Alert.alert("Error", "Item name cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, "shoppinglist"), { name: newItem });

      // 🔥 No need to manually update state (onSnapshot does it)
      setNewItem(""); // Clears input field immediately

    } catch (error) {
      console.error("Error adding item: ", error);
      Alert.alert("Error", "Could not add item. Check Firebase permissions.");
    }
  };

  // ✅ Remove item from Firestore and update UI automatically
  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, "shoppinglist", id));

      // 🔥 No need to manually update state (onSnapshot does it)

    } catch (error) {
      console.error("Error deleting item: ", error);
      Alert.alert("Error", "Could not delete item.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Shopping List</Text>

      {/* Input Field */}
      <TextInput
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Add new item..."
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      {/* Add Button */}
      <TouchableOpacity
        onPress={addItem}
        style={{
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Add</Text>
      </TouchableOpacity>

      {/* Shopping List Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={{ color: "red", fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ShoppingList;
