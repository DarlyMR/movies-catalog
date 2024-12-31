import React from 'react';
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

const MovieCard: React.FC<{movie: Movie; stlye?: StyleProp<ViewStyle>}> = ({
  movie,
}) => {
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

  return (
    // Card container view
    <TouchableOpacity
      style={{...styles.container}}
      onPress={() => navigation.navigate('MovieDetails', {idMovie: movie.id})}>
      <View style={{padding: 10}}>
        <Image
          src={`${API_IMAGE_URL}/w500/${movie.poster_path}`}
          style={styles.image}
        />
      </View>

      {/* Info */}
      <View style={{flex: 1}}>
        <Text numberOfLines={2} style={styles.title}>
          {movie.title}
        </Text>
        <View style={styles.bottomInfo}>
          <Text>{getReleaseDate()}</Text>
          <Star votesAverage={movie.vote_average} />
        </View>
      </View>
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
  star: {
    color: '#fab129',
    borderColor: 'black',
    fontSize: 20,
  },
});

export default MovieCard;
