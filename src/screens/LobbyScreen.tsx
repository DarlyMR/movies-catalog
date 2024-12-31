import React, {useCallback, useContext, useEffect, useState} from 'react';
import MovieGridList from '../components/MovieGridList';
import {getFavorites, getNowPlaying} from '../services/MovieService';
import {Context} from '../utils/context/authContext';
import {Movie} from '../utils/interfaces/movie-search';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Button, View} from 'react-native';

const LobbyScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {setFavoriteMovieIds, sessionId} = useContext(Context);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const moviesNowPlaying = await getNowPlaying();
      const favoriteMovies = await getFavorites(sessionId);
      const sortedMovies = moviesNowPlaying.results.sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      setMovies(sortedMovies);
      setFavoriteMovieIds(favoriteMovies.map(movie => movie.id));
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  const navigation =
    useNavigation<
      NavigationProp<{Home: undefined; FavoriteScreen: undefined}>
    >();
  return (
    <View style={{flex: 1}}>
      <Button
        title="Ver peliculas favoritas"
        color="red"
        onPress={() => navigation.navigate('FavoriteScreen')}
      />
      <MovieGridList
        movies={movies}
        loading={loading}
        error={error}
        onRefresh={fetchMovies}
        title="Actualmente en cines"
      />
    </View>
  );
};

export default LobbyScreen;
