import React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { View } from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../constants/colors";

const TEXTMARGINVERTICAL = "2%";

const Help = () => (
  <SafeAreaView style={styles.screen} edges={["right", "left", "top"]}>
    <ScrollView
      style={styles.textContainer}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Справка</Text>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Домашняя страница
        </Text>
        <Text style={styles.text}>
          На этой странице отображены фильмы и сериалы, рекомендованные
          пользователю. Данные рекомендации создаются отдельно для каждого
          пользователя, основываясь на понравившихся фильмах. Если же у
          пользователя список избранных пуст, то на домашней странице
          отобразятся недавно вышедшие фильмы и сериалы с большим рейтингом. Для
          того, чтобы поменять фильм достаточно свайпнуть влево или вправо.
          После выбора фильма можно нажать на кнопку с названием и постером
          данного кино и откроется страница фильма.
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Поиск
        </Text>
        <Text style={styles.text}>
          На этой странице пользователь может произвести поиск фильмов и
          сериалов по ключевому слову, жанру и типу (например, фильм или
          сериал). Для поиска по ключевому слову достаточно ввести слово или
          словосочетание в поле ввода. Поисковая система настроена так, что в
          первую очередь показываются фильмы с совпадением по названию, а уже
          потом показываются результаты поиска по другим данным (например,
          описанию, жанрам, актерам и т. д.). Также данная поисковая система
          учитывает орфографические ошибки. Для фильтрации фильмов пользователю
          достаточно выбрать тип и жанр из списка. На любой фильм в списке можно
          нажать и перейти на страницу фильма.
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Профиль
        </Text>
        <Text style={styles.text}>
          Здесь выводится информация о пользователе (почта, имя, отчество,
          фамилия) и две больших кнопки для перехода на страницу понравившихся
          фильмов или на страницу истории просмотров. Также рядом с информацией
          о пользователе находится маленькая кнопка для выхода из аккаунта,
          после которого пользователя переносит на страницу входа.
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Избранное
        </Text>
        <Text style={styles.text}>
          В данном разделе выводится список понравившихся фильмов, которые
          пользователь добавил в избранное. Данный список отсортирован по дате и
          времени добавления. На любой фильм в списке можно нажать и перейти на
          страницу фильма.
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          История
        </Text>
        <Text style={styles.text}>
          В данном разделе выводится список фильмов, которые пользователь
          просмотрел. Данный список отсортирован по дате и времени просмотра. На
          любой фильм в списке можно нажать и перейти на страницу фильма.
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20, fontWeight: "400" }]}>
          Страница фильма
        </Text>
        <Text style={styles.text}>
          На этом экране находится вся информация (название, тип, жанры,
          рейтинг, режиссеры, актеры, описание, дата выхода) по конкретному
          фильму или сериалу. В нижней части страницы находится видеоплеер.
          Также есть кнопка «Добавить в избранное», при нажатии на которую фильм
          добавляется в раздел «Избранное». Все фильмы, добавленные
          пользователем в этот раздел, можно посмотреть на странице
          понравившихся фильмов. Для удаления фильма из раздела «Избранное»
          достаточно нажать на оранжевую кнопку «Добавлено в избранное». Также
          фильм можно развернуть на полный экран.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

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
  container: { marginBottom: "5%" },
  text: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "justify",
  },
});

export default Help;
