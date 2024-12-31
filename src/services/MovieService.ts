import { Movie, MovieSearch } from '../utils/interfaces/movie-search';

import { API_KEY, API_URL } from '@env';

const getAPIData = async <T>(path: string, params?: string): Promise<T> => {
  const url = `${API_URL}${path}?api_key=${API_KEY}&language=es-MX${
    params ? params : ''
  }`;

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export const getNowPlayingMovies = () =>
  getAPIData<MovieSearch>('/movie/now_playing', '&page=1');
export const getSimilarsMovies = (movieId) =>
  getAPIData<MovieSearch>(`/movie/${movieId}/similar`, '&page=1');

export const getMovie = <T = Movie>(
  idMovie: number,
  options?: {credits: boolean},
) => getAPIData<T>(`/movie/${idMovie}${options?.credits ? '/credits' : ''}`);

type Rating = {
  movieId: number;
  rating: number;
  guestSessionId: string;
};

export const rateMovie = async ({movieId, rating, guestSessionId}: Rating) => {
  const response = await fetch(
    `${API_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({value: rating}),
    },
  );
  const data = await response.json();
  console.log(data);
};

const getGuestSessionRatings = async (guestSessionId: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}`,
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error al obtener las calificaciones:', error);
    return null;
  }
};
