import React, {useContext, useCallback} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Movie} from '../utils/interfaces/movie-search';
import {API_IMAGE_URL} from '@env';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Star from './ui/Star';
import {Context} from '../utils/context/authContext';
import {addFavorite} from '../services/MovieService';

const MovieCard: React.FC<{movie: Movie; style?: StyleProp<ViewStyle>}> = ({
  movie,
}) => {
  const {favoriteMovieIds, setFavoriteMovieIds, sessionId} =
    useContext(Context);
  const isFavorite = favoriteMovieIds.includes(movie.id);

  const getReleaseDate = () => {
    if (!movie.release_date) {
      return 'Sin fecha';
    }
    const date = new Date(movie.release_date);
    const formatter = new Intl.DateTimeFormat('es-ES', {dateStyle: 'medium'});
    const formattedDate = formatter.format(date);
    return formattedDate;
  };

  const navigation =
    useNavigation<NavigationProp<{MovieDetails: {idMovie: number}}>>();

  const handleToggleFavorite = useCallback(async () => {
    if (!sessionId) return;

    const newFavoriteState = !isFavorite;
    if (newFavoriteState) {
      setFavoriteMovieIds(prev => [...prev, movie.id]);
    } else {
      setFavoriteMovieIds(prev => prev.filter(id => id !== movie.id));
    }

    try {
      await addFavorite({
        favorite: newFavoriteState,
        media_id: movie.id,
        session_id: sessionId,
      });
    } catch (error) {
      // Revert on error
      if (newFavoriteState) {
        setFavoriteMovieIds(prev => prev.filter(id => id !== movie.id));
      } else {
        setFavoriteMovieIds(prev => [...prev, movie.id]);
      }
      console.error('Error toggling favorite:', error);
    }
  }, [movie.id, isFavorite, sessionId, setFavoriteMovieIds]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('MovieDetails', {idMovie: movie.id})}>
      <View style={{padding: 10}}>
        <Image
          src={`${API_IMAGE_URL}/w500/${movie.poster_path}`}
          style={styles.image}
        />
      </View>

      <View style={{flex: 1}}>
        <Text numberOfLines={2} style={styles.title}>
          {movie.title}
        </Text>
        <View style={styles.bottomInfo}>
          <Text>{getReleaseDate()}</Text>
          <Star votesAverage={movie.vote_average} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite && styles.favoriteActive]}
        onPress={handleToggleFavorite}>
        <Text style={styles.favoriteText}>
          {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CECACA',
    borderRadius: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  image: {
    borderRadius: 10,
    resizeMode: 'contain',
    aspectRatio: '2/3',
    maxWidth: 320,
  },
  bottomInfo: {
    fontSize: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 6,
  },
  favoriteButton: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  favoriteActive: {
    backgroundColor: '#ffcccc',
    borderColor: '#ff0000',
  },
  favoriteText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MovieCard;
