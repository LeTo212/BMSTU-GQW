import API_URL from "./constants/config";

const getImagePath = (ID, Type) =>
  `${API_URL}/image?MovieID=${ID}&Type=${Type}`;

export const getVideoPath = (Token, ID, Season, Episode) => {
  Season = Season ? `&Season=${Season}` : "";
  Episode = Episode ? `&Episode=${Episode}` : "";

  return {
    uri: `${API_URL}/video?MovieID=${ID + Season + Episode}`,
    headers: {
      Authorization: `Bearer ${Token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getTypesAndGenres = async () => {
  const results = await fetch(API_URL + "/types_genres").then(x => x.json());
  const info = {
    types: results.Types.map(item => (item = { label: item, value: item })),
    genres: results.Genres.map(item => (item = { label: item, value: item })),
  };
  info.types.unshift({ label: "Любые", value: "", selected: true });
  info.genres.unshift({ label: "Любые", value: "", selected: true });
  return info;
};

export const getMovies = async token => {
  if (token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const results = await fetch(API_URL + "/movies", requestOptions).then(x => {
      const statusCode = x.status;
      const data = x.json();
      return Promise.all([{ statusCode: statusCode }, data]);
    });

    const data =
      results[0].statusCode === 200
        ? results[1].map(
            ({
              MovieID,
              Title,
              Type,
              Genres,
              Directors,
              Rating,
              Description,
              ReleaseDate,
              Seasons,
            }) => ({
              key: String(MovieID),
              title: Title,
              type: Type,
              genres: Genres,
              directors: Directors,
              rating: Rating,
              description: Description,
              releaseDate: ReleaseDate,
              poster: getImagePath(MovieID, "Poster"),
              backdrop: getImagePath(MovieID, "Backdrop"),
              seasons: Seasons,
            })
          )
        : null;

    return { ...results[0], data };
  }
  return;
};

export const getFavorites = async token => {
  if (token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const results = await fetch(API_URL + `/favorites`, requestOptions).then(
      x => {
        const statusCode = x.status;
        const data = x.json();
        return Promise.all([{ statusCode: statusCode }, data]);
      }
    );
    return { ...results[0], ...{ data: results[1] } };
  }
  return;
};

export const changeFavorite = async (movieID, isValid, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  await fetch(
    API_URL + `/favorite?MovieID=${movieID}&isValid=${isValid}`,
    requestOptions
  );
  return;
};

// Authentication

export const checkUser = async (userName, password) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userName, password: password }),
  };

  const result = await fetch(API_URL + "/signin", requestOptions)
    .then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([{ statusCode: statusCode }, data]);
    })
    .catch(e => {
      throw e;
    });

  return { ...result[0], ...result[1] };
};

export const createUser = async (
  userName,
  firstname,
  middlename,
  surname,
  password,
  password_repeat
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userName,
      firstname: firstname,
      middlename: middlename,
      surname: surname,
      password: password,
      password_repeat: password_repeat,
    }),
  };

  const result = await fetch(API_URL + "/signup", requestOptions)
    .then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([{ statusCode: statusCode }, data]);
    })
    .catch(e => {
      throw e;
    });

  return { ...result[0], ...result[1] };
};
