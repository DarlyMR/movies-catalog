import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Movie} from '../utils/interfaces/movie-search';
import {API_IMAGE_URL} from '@env';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const StarIcon = () => (
  <FontAwesome6 style={styles.star} name={'star'} iconStyle="solid" />
);

const MovieCard: React.FC<{movie: Movie; stlye?: StyleProp<ViewStyle>}> = ({
  movie,
}) => {
  const date = new Date(movie.release_date);
  const formatter = new Intl.DateTimeFormat('en-US', {dateStyle: 'long'});
  const formattedDate = formatter.format(date);

  return (
    // Card container view
    <View style={{...styles.container}}>
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
          <Text>{formattedDate}</Text>
          <View style={styles.innerInfo}>
            <Text style={{fontWeight: 'bold'}}>
              {movie.vote_average.toFixed(1)}/10
            </Text>
            <StarIcon />
          </View>
        </View>
      </View>
    </View>
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
  innerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MovieCard;
