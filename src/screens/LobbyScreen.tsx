import {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import MovieCard from '../components/MovieCard';
import {getNowPlayingMovies} from '../services/MovieService';
import {Movie} from '../utils/interfaces/movie-search';

const LobbyScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const _getNowPlayingMovies = () => {
    getNowPlayingMovies()
      .then(
        response =>
          setMovies(
            response.results.sort((a, b) => a.title.localeCompare(b.title)),
          ),
        error => console.log(error),
      )
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    _getNowPlayingMovies();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatContainer}
        numColumns={2}
        data={movies}
        contentContainerStyle={styles.gap}
        columnWrapperStyle={styles.gap}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => _getNowPlayingMovies()}
          />
        }
        renderItem={({item}) => (
          <View style={{width: '48%'}}>
            <MovieCard key={item.id} movie={item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#252323',
  },

  flatContainer: {
    flex: 1,
    display: 'flex',
    rowGap: 10,
  },
  gap: {
    gap: 10,
  },
});

export default LobbyScreen;
