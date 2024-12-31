import {API_IMAGE_URL} from '@env';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ActorCard from '../components/ActorCard';
import RateModal from '../components/RateModal';
import Star from '../components/ui/Star';
import {globalStyles} from '../config/theme';
import {
  addFavorite,
  getMovie,
  getSimilarsMovies,
} from '../services/MovieService';
import {Cast, Credit} from '../utils/interfaces/credit';
import {Movie} from '../utils/interfaces/movie-search';
import MovieCard from '../components/MovieCard';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {Context} from '../utils/context/authContext';

interface MovieDetailsProps {
  route: RouteProp<{params: {idMovie: number}}, 'params'>;
  navigation: NavigationProp<any>;
}

const FavoriteButton: React.FC<{
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({isFavorite, onToggleFavorite}) => (
  <TouchableOpacity
    onPress={onToggleFavorite}
    style={[
      styles.favoriteButton,
      isFavorite ? styles.favoriteActive : styles.favoriteInactive,
    ]}>
    <FontAwesome6
      name="heart"
      iconStyle={isFavorite ? 'solid' : 'regular'}
      size={24}
      color={isFavorite ? '#fff' : '#ff6b6b'}
    />
  </TouchableOpacity>
);

const MovieHeader: React.FC<{movie: Movie | undefined}> = ({movie}) => (
  <View style={styles.headerContainer}>
    {movie?.backdrop_path && (
      <Image
        source={{uri: `${API_IMAGE_URL}/w1280/${movie.backdrop_path}`}}
        style={styles.image}
      />
    )}
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={[globalStyles.title, styles.title]}>
      {movie?.title}
    </Text>
  </View>
);

const MovieInfo: React.FC<{
  movie: Movie | undefined;
  genres: string;
  onRate: () => void;
}> = ({movie, genres, onRate}) => (
  <View>
    <View style={styles.yearRate}>
      <Star votesAverage={movie?.vote_average ?? 0} textColor="white" />
      <Button onPress={onRate} title="Calificar" />
      <Text style={styles.yearText}>
        {movie?.release_date ? new Date(movie.release_date).getFullYear() : ''}
      </Text>
    </View>
    <Text style={styles.overview}>
      <Text style={styles.boldText}>Géneros: </Text>
      <Text>{genres}</Text>
    </Text>
  </View>
);

const CastSection: React.FC<{cast: Cast[]}> = React.memo(({cast}) => (
  <View style={styles.castContainer}>
    <Text style={styles.subTitle}>Reparto</Text>
    <ScrollView horizontal contentContainerStyle={styles.gap}>
      {cast.map(actor => (
        <View key={`actor-${actor.id}`} style={styles.actorContainer}>
          <ActorCard actor={actor} />
        </View>
      ))}
    </ScrollView>
  </View>
));

const SimilarMovies: React.FC<{movies: Movie[]}> = React.memo(({movies}) => (
  <View>
    <Text style={styles.subTitle}>Películas similares</Text>
    <ScrollView
      horizontal
      contentContainerStyle={[styles.gap, styles.similarMoviesContainer]}>
      {movies.map(movie => (
        <View
          key={`similar-movie-${movie.id}`}
          style={styles.movieCardContainer}>
          <MovieCard movie={movie} />
        </View>
      ))}
    </ScrollView>
  </View>
));

const MovieDetails: React.FC<MovieDetailsProps> = ({route}) => {
  const {idMovie} = route.params;
  const [movieData, setMovieData] = useState<{
    movie?: Movie;
    similarMovies?: Movie[];
    genres: string;
    cast: Cast[];
  }>({
    genres: '',
    cast: [],
  });
  const {sessionId, favoriteMovieIds, setFavoriteMovieIds} =
    useContext(Context);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(
    () => setIsFavorite(favoriteMovieIds.includes(idMovie)),
    [favoriteMovieIds, idMovie],
  );

  const fetchMovieData = useCallback(async () => {
    try {
      const [movieResponse, creditsResponse, similarMoviesResponse] =
        await Promise.all([
          getMovie(idMovie),
          getMovie<Credit>(idMovie, {credits: true}),
          getSimilarsMovies(idMovie),
        ]);

      setMovieData({
        movie: movieResponse,
        similarMovies: similarMoviesResponse.results,
        genres: movieResponse.genres.map(genre => genre.name).join(', '),
        cast: creditsResponse.cast,
      });
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  }, [idMovie]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const toggleModal = useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  const movieHeader = useMemo(
    () => <MovieHeader movie={movieData.movie} />,
    [movieData.movie],
  );

  const movieInfo = useMemo(
    () => (
      <MovieInfo
        movie={movieData.movie}
        genres={movieData.genres}
        onRate={toggleModal}
      />
    ),
    [movieData.movie, movieData.genres, toggleModal],
  );

  const handleToggleFavorite = useCallback(async () => {
    if (!sessionId) return;

    const newFavoriteState = !isFavorite;
    if (newFavoriteState) {
      setFavoriteMovieIds(prev => [...prev, idMovie]);
    } else {
      setFavoriteMovieIds(prev => prev.filter(id => id !== idMovie));
    }

    try {
      await addFavorite({
        favorite: newFavoriteState,
        media_id: idMovie,
        session_id: sessionId,
      });
    } catch (error) {
      // Revert on error
      if (newFavoriteState) {
        setFavoriteMovieIds(prev => prev.filter(id => id !== idMovie));
      } else {
        setFavoriteMovieIds(prev => [...prev, idMovie]);
      }
      console.error('Error toggling favorite:', error);
    }
  }, [idMovie, isFavorite, sessionId, setFavoriteMovieIds]);

  return (
    <View style={globalStyles.mainContainer}>
      {movieData.movie?.id && (
        <RateModal
          closeModal={setModalVisible}
          modalVisible={modalVisible}
          movie={movieData.movie}
        />
      )}
      {movieHeader}
      <FavoriteButton
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
      <ScrollView contentContainerStyle={styles.infoContainer}>
        {movieInfo}
        <CastSection cast={movieData.cast} />
        <Text style={styles.subTitle}>Sinopsis</Text>
        <Text style={styles.overview}>{movieData.movie?.overview}</Text>
        {movieData.similarMovies && (
          <SimilarMovies movies={movieData.similarMovies} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    aspectRatio: '16/9',
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  infoContainer: {
    padding: 10,
  },
  subTitle: {
    ...globalStyles.subTitle,
    textAlign: 'center',
    color: 'white',
  },
  overview: {
    fontSize: 16,
    color: 'white',
    textAlign: 'justify',
  },
  yearRate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  castContainer: {
    marginVertical: 10,
  },
  gap: {
    gap: 10,
  },
  yearText: {
    textAlign: 'right',
    color: 'white',
  },
  boldText: {
    fontWeight: 'bold',
  },
  actorContainer: {
    aspectRatio: '2/4',
  },
  movieCardContainer: {
    aspectRatio: '2/3.5',
  },
  similarMoviesContainer: {
    height: 400,
  },
  favoriteButton: {
    marginTop: 5,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteActive: {
    backgroundColor: '#ff6b6b',
  },
  favoriteInactive: {
    backgroundColor: '#fff',
  },
});

export default React.memo(MovieDetails);
