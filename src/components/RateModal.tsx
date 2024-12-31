import React, {useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import {getStoredGuestSession} from '../services/AuthService';
import {rateMovie} from '../services/MovieService';
import {Movie} from '../utils/interfaces/movie-search';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface Props {
  //   rating;
  movie: Movie;
  modalVisible: boolean;
  closeModal: (modalVisible: boolean) => void;
}

const CloseIcon = () => {
  return <FontAwesome6 style={styles.xmark} name={'xmark'} iconStyle="solid" />;
};
const RateModal: React.FC<Props> = ({modalVisible, closeModal, movie}) => {
  const [rating, setRating] = useState(Math.round(movie.vote_average));
  const [guestSessionId, setGuestSessionId] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  getStoredGuestSession().then(response => {
    if (response) setGuestSessionId(response.guest_session_id);
  });

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const onRate = () => {
    setLoading(true);
    rateMovie({
      guestSessionId: guestSessionId ?? '',
      movieId: movie.id,
      rating,
    })
      .then(
        response => {
          console.log('🤔   => response:', response);
          showToast('Pelicula calificada con exito!');
        },
        error => {
          showToast('Ha ocurrido un error al calificar pelicula');
          console.error('Error rating the movie: ', error);
        },
      )
      .finally(() => {
        closeModal(!modalVisible);
        setLoading(false);
      });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => closeModal(!modalVisible)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.closeContainer}>
            <TouchableOpacity onPress={() => closeModal(!modalVisible)}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalText}>
            ¿Te ha gustado esta pelicula? ¡Califica!
          </Text>
          <StarRating
            rating={rating}
            onChange={setRating}
            maxStars={10}
            starSize={28}
          />
          {!loading ? (
            <Button
              disabled={rating === 0 || loading}
              title="Calificar"
              onPress={() => onRate()}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingInline: 3,
    paddingBottom: 35,
    paddingTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
  },
  closeContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4e4e4e',
    borderRadius: '50%',
    width: 40,
    height: 40,
    marginRight: 7,
  },
  xmark: {
    fontSize: 24,
    color: 'white',
  },
});

export default RateModal;
