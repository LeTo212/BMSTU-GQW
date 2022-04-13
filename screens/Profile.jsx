import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";

import Loading from "../components/Loading";
import AuthContext from "../constants/context";
import Card from "../components/Card";
import Colors from "../constants/colors";

const source = require("../assets/userIcon.png");

const Profile = ({ navigation }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const { getToken } = React.useContext(AuthContext);
  const { getUser, signOut } = React.useContext(AuthContext);

  useEffect(() => {
    getToken().then((data) => {
      if (!data) {
        signOut();
        return;
      }

      setToken(data);
    });

    getUser().then((data) => {
      setUser(data);
    });
  }, [token]);

  if (!token || !user) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Card style={styles.profile}>
        <Image
          source={source}
          style={{
            width: 100,
            height: 100,
            marginHorizontal: "5%",
            position: "relative",
          }}
        />
        {user ? (
          <View style={styles.info}>
            <Text style={styles.text}>Имя: {user.firstname}</Text>
            {user.middlename ? (
              <Text style={styles.text}>Отчество: {user.middlename}</Text>
            ) : null}
            <Text style={styles.text}>Фамилия: {user.surname}</Text>
            <Text style={styles.text}>Почта: {user.email}</Text>
          </View>
        ) : null}

        <View style={styles.signOut}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={{ ...styles.text, marginRight: "3%" }}>Выйти</Text>
            <MaterialCommunityIcons name="logout" size={20} />
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{ margin: "5%", borderBottomWidth: 1 }}>
        <Text
          style={{ fontSize: 20, fontWeight: "800", paddingVertical: "1%" }}
        >
          Разделы
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Favorites")}
        style={{
          margin: "5%",
          marginTop: 0,
        }}
      >
        <Card style={styles.button}>
          <Text style={styles.buttonText}>Избранное</Text>
          <Feather name="chevron-right" size={25} />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("History")}
        style={{
          margin: "5%",
          marginTop: 0,
        }}
      >
        <Card style={styles.button}>
          <Text style={styles.buttonText}>История</Text>
          <Feather name="chevron-right" size={25} />
        </Card>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profile: {
    height: 200,
    marginVertical: "2%",
    marginHorizontal: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flexDirection: "column",
    height: 100,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  signOut: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    padding: "5%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  button: {
    padding: "3%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default Profile;
