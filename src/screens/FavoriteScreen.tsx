import React, {useEffect, useState, useCallback, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MovieGridList from '../components/MovieGridList';
import {getFavorites} from '../services/MovieService';
import {Movie} from '../utils/interfaces/movie-search';
import {Context} from '../utils/context/authContext';
import {globalStyles} from '../config/theme';

const FavoritesScreen = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {sessionId} = useContext(Context);

  const fetchFavorites = useCallback(async () => {
    if (!sessionId) {
      setError('Debes iniciar sesión para ver tus favoritos');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const favorites = await getFavorites(sessionId);
      const sortedFavorites = favorites.sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      setFavoriteMovies(sortedFavorites);
    } catch (err) {
      setError(
        'No se pudieron cargar las películas favoritas. Intenta nuevamente.',
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (!sessionId) {
    return (
      <View style={styles.noSessionContainer}>
        <Text style={styles.noSessionText}>
          Inicia sesión para ver tus películas favoritas
        </Text>
      </View>
    );
  }

  if (!loading && favoriteMovies.length === 0) {
    return (
      <View style={styles.noFavoritesContainer}>
        <Text style={styles.noFavoritesText}>
          No tienes películas favoritas aún
        </Text>
      </View>
    );
  }

  return (
    <MovieGridList
      movies={favoriteMovies}
      loading={loading}
      error={error}
      onRefresh={fetchFavorites}
      title="Mis Películas Favoritas"
    />
  );
};

const styles = StyleSheet.create({
  noSessionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252323',
    padding: 20,
  },
  noSessionText: {
    ...globalStyles.title,
    color: 'white',
    textAlign: 'center',
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252323',
    padding: 20,
  },
  noFavoritesText: {
    ...globalStyles.title,
    color: 'white',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
