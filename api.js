import API_URL from "./constants/config";

const getImageURL = (ID, Type) => `${API_URL}/image?MovieID=${ID}&Type=${Type}`;

export const getVideoPath = (token, ID, season, episode) => {
  const ssn = season ? `&Season=${season}` : "";
  const ep = episode ? `&Episode=${episode}` : "";

  return {
    uri: `${API_URL}/video?MovieID=${ID + ssn + ep}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const editMovies = (movies) =>
  movies.map(
    ({
      MovieID,
      Title,
      Type,
      Genres,
      Directors,
      Actors,
      Rating,
      Description,
      ReleaseDate,
      Seasons,
    }) => ({
      key: MovieID,
      title: Title,
      type: Type,
      genres: Genres,
      actors: Actors,
      directors: Directors,
      rating: Rating,
      description: Description,
      releaseDate: ReleaseDate,
      poster: getImageURL(MovieID, "Poster"),
      backdrop: getImageURL(MovieID, "Backdrop"),
      seasons: Seasons,
    })
  );

export const getTypesAndGenres = async () => {
  const results = await fetch(`${API_URL}/types_genres`).then((x) => x.json());
  const info = {
    types: results.Types.map((item) => ({ label: item, value: item })),
    genres: results.Genres.map((item) => ({ label: item, value: item })),
  };
  info.types.unshift({ label: "Любые", value: "", selected: true });
  info.genres.unshift({ label: "Любые", value: "", selected: true });
  return info;
};

export const getMovies = async (token) => {
  if (token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const results = await fetch(`${API_URL}/movies`, requestOptions).then(
      (x) => {
        const statusCode = x.status;
        const data = x.json();
        return Promise.all([{ statusCode }, data]);
      }
    );

    if (results[0].statusCode === 200) {
      return editMovies(results[1]);
    }

    if (new Set([400, 401, 500]).has(results[0].statusCode)) {
      return "Error";
    }
  }

  return [];
};

//// Favorites
//
export const getFavorites = async (token) => {
  if (token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const results = await fetch(`${API_URL}/favorites`, requestOptions).then(
      (x) => {
        const statusCode = x.status;
        const data = x.json();
        return Promise.all([{ statusCode }, data]);
      }
    );

    if (results[0].statusCode === 200) {
      return editMovies(results[1]);
    }

    if (new Set([400, 401, 500]).has(results[0].statusCode)) {
      return "Error";
    }
  }

  return null;
};

export const changeFavorite = async (token, movieID, isValid) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  await fetch(
    `${API_URL}/favorite?MovieID=${movieID}&isValid=${isValid}`,
    requestOptions
  );
};
//
////

//// History
//
export const getHistory = async (token) => {
  if (token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const results = await fetch(`${API_URL}/history`, requestOptions).then(
      (x) => {
        const statusCode = x.status;
        const data = x.json();
        return Promise.all([{ statusCode }, data]);
      }
    );

    if (results[0].statusCode === 200) {
      return editMovies(results[1]);
    }

    if (new Set([400, 401, 500]).has(results[0].statusCode)) {
      return "Error";
    }
  }

  return null;
};

export const addToHistory = async (token, movieID) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  await fetch(`${API_URL}/addToHistory?MovieID=${movieID}`, requestOptions);
};
//
////

//// Authentication
//
export const checkUser = async (userName, password) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userName, password }),
  };

  const result = await fetch(`${API_URL}/signin`, requestOptions)
    .then((response) => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([{ statusCode }, data]);
    })
    .catch((e) => {
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
  passwordRepeat
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userName,
      firstname,
      middlename,
      surname,
      password,
      passwordRepeat,
    }),
  };

  const result = await fetch(`${API_URL}/signup`, requestOptions)
    .then((response) => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([{ statusCode }, data]);
    })
    .catch((e) => {
      throw e;
    });

  return { ...result[0], ...result[1] };
};
//
////
