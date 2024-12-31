import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {rateMovie} from '../services/MovieService';
import {Movie} from '../utils/interfaces/movie-search';
import {getStoredSessionId} from '../services/AuthService';

interface RateModalProps {
  movie: Movie;
  modalVisible: boolean;
  closeModal: (modalVisible: boolean) => void;
}

interface RateModalState {
  rating: number;
  sessionId?: string;
  isLoading: boolean;
}

const CloseButton: React.FC<{onPress: () => void}> = React.memo(({onPress}) => (
  <Pressable
    onPress={onPress}
    style={styles.closeContainer}
    android_ripple={{color: '#666', borderless: true}}>
    <FontAwesome6 style={styles.closeIcon} name="xmark" iconStyle="solid" />
  </Pressable>
));

const LoadingButton: React.FC<{
  isLoading: boolean;
  disabled: boolean;
  onPress: () => void;
}> = React.memo(({isLoading, disabled, onPress}) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#2196F3" />;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.rateButton,
        disabled && styles.rateButtonDisabled,
        pressed && styles.rateButtonPressed,
      ]}>
      <Text style={styles.rateButtonText}>Calificar</Text>
    </Pressable>
  );
});

const RateModal: React.FC<RateModalProps> = ({
  modalVisible,
  closeModal,
  movie,
}) => {
  const [state, setState] = useState<RateModalState>({
    rating: Math.round(movie.vote_average),
    isLoading: false,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const session = await getStoredSessionId();
        if (isMounted && session) {
          setState(prev => ({
            ...prev,
            sessionId: session,
          }));
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        showToast('Error al obtener la sesión');
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  });

  const showToast = useCallback((message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }, []);

  const handleRating = useCallback((newRating: number) => {
    setState(prev => ({...prev, rating: newRating}));
  }, []);

  const handleClose = useCallback(() => {
    closeModal(!modalVisible);
  }, [closeModal, modalVisible]);

  const handleRate = useCallback(async () => {
    if (!state.sessionId) {
      showToast('Sesión no disponible');
      return;
    }

    setState(prev => ({...prev, isLoading: true}));

    try {
      await rateMovie({
        session_id: state.sessionId,
        movieId: movie.id,
        rating: state.rating,
      });
      showToast('¡Película calificada con éxito!');
      handleClose();
    } catch (error) {
      console.error('Error rating movie:', error);
      showToast('Ha ocurrido un error al calificar la película');
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  }, [state.sessionId, state.rating, movie.id, handleClose, showToast]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}>
            <CloseButton onPress={handleClose} />

            <Text style={styles.modalTitle}>
              ¿Te ha gustado esta película? ¡Califica!
            </Text>

            <StarRating
              rating={state.rating}
              onChange={handleRating}
              maxStars={10}
              starSize={28}
              starStyle={styles.star}
            />

            <LoadingButton
              isLoading={state.isLoading}
              disabled={state.rating === 0 || state.isLoading}
              onPress={handleRate}
            />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#4e4e4e',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: 'white',
  },
  modalTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  star: {
    marginHorizontal: 2,
  },
  rateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
  },
  rateButtonDisabled: {
    backgroundColor: '#BDBDBD',
    elevation: 0,
  },
  rateButtonPressed: {
    backgroundColor: '#1976D2',
    elevation: 1,
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(RateModal);
