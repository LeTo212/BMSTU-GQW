import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Favorites from "../screens/Favorites";
import MoviePage from "../screens/MoviePage";
import Colors from "../constants/colors";

const Stack = createStackNavigator();

const FavoritesNav = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Favorites"
      component={Favorites}
      options={{
        title: "Избранное",
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

export default FavoritesNav;
