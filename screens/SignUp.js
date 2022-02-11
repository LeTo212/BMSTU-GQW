import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

import { createUser } from "../api";
import Colors from "../constants/colors";

const SignUp = ({ navigation }) => {
  const [data, setData] = React.useState({
    username: "",
    firstname: "",
    middlename: "",
    surname: "",
    password: "",
    confirm_password: "",
    check_textInputChange: false,
    check_firstnameInputChange: false,
    check_middlenameInputChange: false,
    check_surnameInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  });

  const textInputChange = val => {
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

  const handleFirstnameChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        firstname: val,
        check_firstnameInputChange: true,
      });
    } else {
      setData({
        ...data,
        firstname: val,
        check_firstnameInputChange: false,
      });
    }
  };

  const handleMiddlenameChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        middlename: val,
        check_middlenameInputChange: true,
      });
    } else {
      setData({
        ...data,
        middlename: val,
        check_middlenameInputChange: false,
      });
    }
  };

  const handleSurnameChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        surname: val,
        check_surnameInputChange: true,
      });
    } else {
      setData({
        ...data,
        surname: val,
        check_surnameInputChange: false,
      });
    }
  };

  const handlePasswordChange = val => {
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

  const handleConfirmPasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        confirm_password: val.replace(/\s/g, ""),
        isValidConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        confirm_password: val.replace(/\s/g, ""),
        isValidConfirmPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  const handleValidUser = val => {
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

  const signupHandle = async (
    userName,
    firstname,
    middlename,
    surname,
    password,
    password_repeat
  ) => {
    if (
      userName.length == 0 ||
      firstname.length == 0 ||
      surname.length == 0 ||
      password.length == 0
    ) {
      Alert.alert(
        "Неправильный ввод!",
        "Поля ввода кроме отчества не могут быть пустыми.",
        [{ text: "Хорошо" }]
      );
      return;
    }

    if (!data.isValidPassword || !data.isValidConfirmPassword) {
      Alert.alert("Неправильный ввод!", "Пароли введены неправильно.", [
        { text: "Хорошо" },
      ]);
    }

    if (password !== password_repeat) {
      Alert.alert("Неправильный ввод!", "Пароли не совпадают.", [
        { text: "Хорошо" },
      ]);
    }

    const user = await createUser(
      userName,
      firstname,
      middlename,
      surname,
      password,
      password_repeat
    );

    if (user.statusCode === 201) {
      Alert.alert("Поздравляем!", "Вы успешно создали аккаунт!", [
        { text: "Хорошо" },
      ]);
      navigation.goBack();
    }

    if (user.statusCode === 409) {
      Alert.alert("Ошибка!", "Аккаунт с такой почтой уже существует.", [
        { text: "Хорошо" },
      ]);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : ""}
    >
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Регистрация</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.text_footer}>Почта</Text>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Введите почту"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => textInputChange(val)}
              onEndEditing={e => handleValidUser(e.nativeEvent.text)}
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

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Имя
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Введите имя"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleFirstnameChange(val)}
            />
            {data.check_firstnameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Отчество (Необязательно)
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Введите отчество"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleMiddlenameChange(val)}
            />
            {data.check_middlenameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Фамилия
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Введите фамилию"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleSurnameChange(val)}
            />
            {data.check_surnameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Пароль
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Введите пароль"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handlePasswordChange(val)}
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

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Подтверждение пароля
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Повторите пароль"
              secureTextEntry={data.confirm_secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleConfirmPasswordChange(val)}
              value={data.confirm_password}
            />
            <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
              {data.confirm_secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidConfirmPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Пароль должен быть не менее 8 символов
              </Text>
            </Animatable.View>
          )}

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                signupHandle(
                  data.username,
                  data.firstname,
                  data.middlename,
                  data.surname,
                  data.password,
                  data.confirm_password
                );
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
                      color: "#fff",
                    },
                  ]}
                >
                  Зарегистрироваться
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
                Войти
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
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
  textPrivate: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  color_textPrivate: {
    color: "grey",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
});
