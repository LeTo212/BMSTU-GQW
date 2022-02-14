import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Search from "../screens/Search";
import MoviePage from "../screens/MoviePage";
import Colors from "../constants/colors";

const Stack = createStackNavigator();

const SearchNav = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Search"
      component={Search}
      options={{
        title: "Поиск",
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

export default SearchNav;
