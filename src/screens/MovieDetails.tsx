import {API_IMAGE_URL} from '@env';
import React, {useEffect, useState} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ActorCard from '../components/ActorCard';
import RateModal from '../components/RateModal';
import Star from '../components/ui/Star';
import {globalStyles} from '../config/theme';
import {getMovie, getSimilarsMovies} from '../services/MovieService';
import {Cast, Credit} from '../utils/interfaces/credit';
import {Movie} from '../utils/interfaces/movie-search';
import MovieCard from '../components/MovieCard';

const MovieDetails: React.FC<{route: any; navigation: any}> = ({route}) => {
  const {idMovie} = route.params;
  const [movie, setMovie] = useState<Movie>();
  const [similarMovies, setSimilarMovies] = useState<Movie[]>();
  const [genres, setGenres] = useState<string>();
  const [cast, setCast] = useState<Cast[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      getMovie(idMovie),
      getMovie<Credit>(idMovie, {credits: true}),
      getSimilarsMovies(idMovie),
    ])
      .then(response => {
        const [movieResponse, creditsResponse, similarMoviesResponse] =
          response;
        setMovie(movieResponse);
        setSimilarMovies(similarMoviesResponse.results);
        setGenres(movieResponse.genres.map(genre => genre.name).join(', '));
        setCast(creditsResponse.cast);
      })
      .catch(error => console.log(error));
  }, [idMovie]);

  return (
    <View style={globalStyles.mainContainer}>
      {/* Image and title container */}
      {movie?.id && (
        <RateModal
          closeModal={setModalVisible}
          modalVisible={modalVisible}
          movie={movie}
        />
      )}
      <View style={styles.headerContainer}>
        {movie?.id && (
          <Image
            src={`${API_IMAGE_URL}/w1280/${movie.backdrop_path}`}
            style={styles.image}
          />
        )}
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{...globalStyles.title, ...styles.title}}>
          {movie?.title}
        </Text>
      </View>
      {/* --------------------------------------- */}
      {/* Main Info */}
      <ScrollView contentContainerStyle={styles.infoContainer}>
        {/* Rate, year and genres */}
        <View style={styles.yearRate}>
          <Star votesAverage={movie?.vote_average ?? 0} textColor="white" />

          <Button onPress={() => setModalVisible(true)} title="Calificar" />

          <Text style={{textAlign: 'right', color: 'white'}}>
            {new Date(movie?.release_date ?? '').getFullYear()}
          </Text>
        </View>
        <Text style={styles.overview}>
          <Text style={{fontWeight: 'bold'}}>Generos: </Text>
          <Text> {genres} </Text>
        </Text>
        {/* Cast */}
        <View style={styles.castContainer}>
          <Text style={styles.subTitle}>Reparto</Text>
          <ScrollView horizontal contentContainerStyle={styles.gap}>
            {cast.map(actor => (
              <View key={`$actor-${actor.id}`} style={{aspectRatio: '2/4'}}>
                <ActorCard actor={actor} />
              </View>
            ))}
          </ScrollView>
        </View>
        <Text style={styles.subTitle}>Sinopsis</Text>
        <Text style={styles.overview}>{movie?.overview}</Text>
        {/* --------------------------------------- */}
        {similarMovies && (
          <View>
            <Text style={styles.subTitle}>Películas similares</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{...styles.gap, height: 400}}>
              {similarMovies.map(SimilarMovie => (
                <View
                  key={`similar-movie-${SimilarMovie.id}`}
                  style={{aspectRatio: '2/3.5'}}>
                  <MovieCard movie={SimilarMovie} />
                </View>
              ))}
            </ScrollView>
          </View>
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
  yearRate: {flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
  castContainer: {
    // height: 200,
  },
  gap: {
    gap: 10,
  },
  rateButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
});

export default MovieDetails;
