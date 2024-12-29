import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Movie} from '../utils/interfaces/movie-search';
import {API_IMAGE_URL} from '@env';

const MovieCard: React.FC<{movie: Movie}> = ({movie}) => {
  return (
    // Card container view
    <View style={{...styles.container}}>
      <Image src={`${API_IMAGE_URL}/w300/${movie.poster_path}`} style={styles.image} />

      {/* Tittle */}
      <Text style={styles.header}>{movie.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'semibold',
    color: 'black',
  },
  image: {
    borderRadius: 10,
    resizeMode: 'contain',
    aspectRatio: '9/16',
    width: 200,
    backgroundColor: 'red',
  },
});

export default MovieCard;
