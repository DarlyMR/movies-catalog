import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MovieCard from '../components/MovieCard';
import { getMovieSearch } from '../services/MovieSearch';
import { Movie } from '../utils/interfaces/movie-search';
// const Icon = () => <FontAwesome6 name={'address-book'} />;

// const movie = {
//   title: 'Halo',
//   urlImage: 'https://es.web.img3.acsta.net/pictures/22/02/21/20/10/2589351.jpg',
//   description: '',
// };
const LobbyScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  getMovieSearch().then(response => setMovies(response.results));

  return (
    <View style={styles.container}>
      <ScrollView>
        {movies.map(movie => (
          <MovieCard movie={movie} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LobbyScreen;
