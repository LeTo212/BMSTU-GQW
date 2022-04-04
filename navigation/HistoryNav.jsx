import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import History from "../screens/History";
import MoviePage from "../screens/MoviePage";
import Colors from "../constants/colors";

const Stack = createStackNavigator();

const HistoryNav = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="History"
      component={History}
      options={{
        title: "История",
        headerTintColor: "#000",
        headerStyle: {
          backgroundColor: Colors.primary,
        },
      }}
    />
    <Stack.Screen
      name="Movie"
      component={MoviePage}
      options={{
        title: "",
        headerTintColor: "#000",
        headerStyle: {
          backgroundColor: Colors.primary,
        },
      }}
    />
  </Stack.Navigator>
);

export default HistoryNav;
