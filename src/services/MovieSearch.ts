import {MovieSearch} from '../utils/interfaces/movie-search';

// import {API_URL, API_TOKEN, READ_ONLY_TOKEN} from '@env';

export const getMovieSearch = async (): Promise<MovieSearch> => {
  //   query: string,
  //   page: number,
  // ?api_key=${API_KEY}&query=${query}&page=${page}
  // const url = `${API_URL}/discover/movie`;
  // const url = '../utils/mocks/sample-data.json';
  //   const url = './src/utils/mocks/sample-data.json';
  // const response = await fetch(url, {
  //   headers: {
  //     accept: 'application/json',
  //     Authorization: `Bearer ${READ_ONLY_TOKEN}`,
  //   },
  // });
  // const data = await response.json();
  const data = require('../utils/mocks/sample-data.json');
  return data;
};
