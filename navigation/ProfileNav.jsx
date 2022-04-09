import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from "../screens/Profile";
import FavoritesNav from "./FavoritesNav";
import HistoryNav from "./HistoryNav";

const Stack = createStackNavigator();

const ProfileNav = () => (
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
      name="Favorites"
      component={FavoritesNav}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="History"
      component={HistoryNav}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default ProfileNav;
