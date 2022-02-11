import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../constants/colors";

const TEXTMARGINVERTICAL = "2%";

const Help = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.textContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Справка</Text>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Главный экран
        </Text>
        <Text style={styles.text}>
          На данной странице изображены фильмы с рейтингом 8.7 и выше. Вы можете
          прокрутить список влево и вправо. При окончательном выборе фильма или
          сериала достаточно нажать на постер и вы перейдете на страницу с
          подробным описанием.
        </Text>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Поиск
        </Text>
        <Text style={styles.text}>
          В данном разделе вы можете найти любой фильм или сериал, который вас
          интересует. Для этого нужно ввести в поле ввода ключевое слово, по
          которому будет проведен поиск из списка фильмов. Кроме этого можно
          применить фильтры по жанрам или по типу (фильм или сериал).
        </Text>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Профиль
        </Text>
        <Text style={styles.text}>
          Здесь будет указана вся информация о пользователе. Также здесь можно
          найти раздел "Избранные", куда вы можете добавлять интересующие вас
          фильмы и сериал. Для добавления в раздел "Избранные" требуется зайти в
          подробное описание фильма и нажать на кнопку "Добавить в избранное".
          Для выхода из аккаунат достаточно нажать кнопку "Выход".
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  textContainer: {
    paddingVertical: "2%",
    paddingHorizontal: "5%",
  },
  title: {
    marginVertical: TEXTMARGINVERTICAL,
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "700",
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "justify",
  },
});

export default Help;
