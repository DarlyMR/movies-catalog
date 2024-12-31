import {API_IMAGE_URL} from '@env';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import {Cast} from '../utils/interfaces/credit';

interface ActorCardProps {
  actor: Cast;
  width?: number;
}

const DEFAULT_CARD_WIDTH = Dimensions.get('window').width * 0.4;

const PersonIcon: React.FC<{size: number}> = React.memo(({size}) => (
  <FontAwesome6
    name="user"
    iconStyle="solid"
    style={[styles.iconStyle, {fontSize: size * 0.5}]}
  />
));

const ActorImage: React.FC<{actor: Cast; width: number}> = React.memo(
  ({actor, width}) => {
    const imageHeight = width * 1.5;

    if (!actor?.profile_path) {
      return (
        <View style={[styles.personContainer, {width, height: imageHeight}]}>
          <PersonIcon size={width} />
        </View>
      );
    }

    return (
      <Image
        source={{uri: `${API_IMAGE_URL}/w500/${actor.profile_path}`}}
        style={[styles.image, {width, height: imageHeight}]}
      />
    );
  },
);

const ActorInfo: React.FC<{name: string; character: string}> = React.memo(
  ({name, character}) => (
    <View style={styles.infoContainer}>
      <Text numberOfLines={2} style={styles.name}>
        {name}
      </Text>
      <Text style={styles.asText}>Como</Text>
      <Text numberOfLines={2} style={styles.character}>
        {character}
      </Text>
    </View>
  ),
);

const ActorCard: React.FC<ActorCardProps> = ({
  actor,
  width = DEFAULT_CARD_WIDTH,
}) => {
  return (
    <View style={[styles.container, {width}]}>
      <View style={styles.imageWrapper}>
        <ActorImage
          actor={actor}
          width={width - styles.container.padding * 2}
        />
      </View>
      <ActorInfo name={actor.name} character={actor.character ?? ''} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CECACA',
    borderRadius: 20,
    padding: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    borderRadius: 10,
    resizeMode: 'cover',
  },
  personContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d7d7d7',
    borderRadius: 10,
  },
  iconStyle: {
    color: 'gray',
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 4,
  },
  asText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 2,
  },
  character: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default React.memo(ActorCard);
