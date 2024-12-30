import {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import MovieCard from '../components/MovieCard';
import {getMovieSearch} from '../services/MovieSearch';
import {Movie} from '../utils/interfaces/movie-search';
// const Icon = () => <FontAwesome6 name={'address-book'} />;

const LobbyScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  getMovieSearch().then(response =>
    setMovies(response.results.sort((a, b) => a.title.localeCompare(b.title))),
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatContainer}
        numColumns={2}
        data={movies}
        contentContainerStyle={styles.gap}
        columnWrapperStyle={styles.gap}
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
