import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

import { checkUser } from "../api";
import AuthContext from "../constants/context";
import Colors from "../constants/colors";

const SignIn = ({ navigation }) => {
  const [data, setData] = useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const { signIn } = React.useContext(AuthContext);

  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val.replace(/\s/g, ""),
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val.replace(/\s/g, ""),
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = async (userName, password) => {
    if (userName.length === 0 || password.length === 0) {
      Alert.alert(
        "Неправильный ввод!",
        "Почта или пароль не могут быть пустыми.",
        [{ text: "Хорошо" }]
      );
      return;
    }

    const foundUser = await checkUser(userName, password);

    if (foundUser.statusCode === 201) signIn(foundUser.user);

    if (foundUser.statusCode === 401) {
      Alert.alert(
        "Неправильный ввод!",
        "Неправильно введен логин или пароль.",
        [{ text: "Хорошо" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : ""}
    >
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Добро пожаловать!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <View>
          <Text style={styles.textFooter}>Почта</Text>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" size={20} />
            <TextInput
              placeholder="Введите почту"
              placeholderTextColor="#666666"
              maxLength={60}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
              onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.isValidUser ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Почта должна быть не менее 4 символов.
              </Text>
            </Animatable.View>
          )}
        </View>

        <View
          style={{
            marginTop: 35,
          }}
        >
          <Text style={styles.textFooter}>Пароль</Text>
          <View style={styles.action}>
            <Feather name="lock" size={20} />
            <TextInput
              placeholder="Введите пароль"
              placeholderTextColor="#666666"
              maxLength={200}
              secureTextEntry={!!data.secureTextEntry}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handlePasswordChange(val)}
              value={data.password}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Пароль должен быть не менее 8 символов
              </Text>
            </Animatable.View>
          )}
        </View>

        <TouchableOpacity>
          <Text style={{ color: Colors.primary, marginTop: 15 }}>
            Забыли пароль?
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              loginHandle(data.username, data.password);
            }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.signIn}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: Colors.background,
                  },
                ]}
              >
                Войти
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={[
              styles.signIn,
              {
                borderColor: Colors.primary,
                borderWidth: 1,
                marginTop: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: Colors.primary,
                },
              ]}
            >
              Зарегистрироваться
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  textHeader: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  textFooter: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    alignItems: "center",
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
