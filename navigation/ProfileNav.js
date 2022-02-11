import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from "../screens/Profile";
import MoviePage from "../screens/MoviePage";
import Colors from "../constants/colors";

const Stack = createStackNavigator();

export default function ProfileNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Профиль",
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
