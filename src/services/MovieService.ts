import {API_KEY, API_URL} from '@env';
import {Movie, MovieSearch} from '../utils/interfaces/movie-search';

interface APIError {
  status_message: string;
  status_code: number;
}

interface APIResponse<T> {
  data: T;
  error?: APIError;
}

interface APIConfig {
  path: string;
  method?: 'GET' | 'POST' /*| 'PUT' | 'DELETE'*/;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
}

interface RatingRequest {
  movieId: number;
  rating: number;
  session_id: string;
}

interface DataFavorite {
  session_id: string;
  media_id: number;
  favorite: boolean;
}
class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

const DEFAULT_PARAMS = {
  api_key: API_KEY,
  language: 'es-MX',
};

const buildURL = (
  path: string,
  params?: Record<string, string | number | boolean>,
): string => {
  const searchParams = new URLSearchParams({
    ...DEFAULT_PARAMS,
    ...params,
  });

  return `${API_URL}${path}?${searchParams.toString()}`;
};

/**
 * Cliente API
 */
const apiClient = async <T>({
  path,
  method = 'GET',
  params,
  body,
}: APIConfig): Promise<APIResponse<T>> => {
  try {
    const url = buildURL(path, params);
    const headers: Record<string, string> = {
      accept: 'application/json',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.status_message || 'Error en la petición',
      );
    }

    return {data};
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      500,
      error instanceof Error ? error.message : 'Error desconocido',
    );
  }
};

export const movieService = {
  /**
   * Obtiene las películas en cartelera
   */
  getNowPlaying: async (): Promise<MovieSearch> => {
    const {data} = await apiClient<MovieSearch>({
      path: '/movie/now_playing',
      params: {page: 1},
    });
    return data;
  },

  /**
   * Obtiene películas similares a una película específica
   */
  getSimilarsMovies: async (movieId: number): Promise<MovieSearch> => {
    const {data} = await apiClient<MovieSearch>({
      path: `/movie/${movieId}/similar`,
      params: {page: 1},
    });
    return data;
  },

  /**
   * Obtiene detalles de una película específica
   */
  getMovie: async <T = Movie>(
    movieId: number,
    options?: {credits: boolean},
  ): Promise<T> => {
    const path = `/movie/${movieId}${options?.credits ? '/credits' : ''}`;
    const {data} = await apiClient<T>({path});
    return data;
  },

  /**
   * Califica una película
   */
  rateMovie: async ({
    movieId,
    rating,
    session_id,
  }: RatingRequest): Promise<void> => {
    await apiClient({
      path: `/movie/${movieId}/rating`,
      method: 'POST',
      params: {session_id},
      body: {value: rating},
    });
  },

  /**
   * Obtiene las calificaciones de una sesión de invitado
   */
  getSessionRatings: async (sessionId: string): Promise<Movie[]> => {
    const {data} = await apiClient<{results: Movie[]}>({
      path: `/account/21716247/${sessionId}/rated/movies`,
    });
    return data.results;
  },

  /**
   * Agregar pelicula a favoritos
   */
  addFavorite: async ({
    session_id,
    media_id,
    favorite,
  }: DataFavorite): Promise<Movie[]> => {
    const {data} = await apiClient<{results: Movie[]}>({
      path: '/account/21716247/favorite',
      params: {session_id},
      body: {media_id, media_type: 'movie', favorite},
      method: 'POST',
    });
    return data.results;
  },
  /**
   * Agregar pelicula a favoritos
   */
  getFavorites: async (session_id: string): Promise<Movie[]> => {
    const {data} = await apiClient<{results: Movie[]}>({
      path: '/account/21716247/favorite/movies',
      params: {session_id, sort_by: 'created_at.desc'},
    });
    return data.results;
  },
};

export type {RatingRequest, APIError, APIResponse};

export const {
  getNowPlaying,
  getSimilarsMovies,
  getMovie,
  rateMovie,
  getSessionRatings,
  addFavorite,
  getFavorites,
} = movieService;
