import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/Home";
import MoviePage from "../screens/MoviePage";
import Colors from "../constants/colors";

const Stack = createStackNavigator();

export default function HomeNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Домашняя страница",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Movie"
        component={MoviePage}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        }}
      />
    </Stack.Navigator>
  );
}
