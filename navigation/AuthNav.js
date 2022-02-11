import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

const RootStack = createStackNavigator();

const AuthNav = ({ navigation }) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="SignIn" component={SignIn} />
    <RootStack.Screen name="SignUp" component={SignUp} />
  </RootStack.Navigator>
);

export default AuthNav;
