import {API_IMAGE_URL} from '@env';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Cast} from '../utils/interfaces/credit';

const PersonIcon = () => {
  return (
    <FontAwesome6
      name={'user'}
      iconStyle="solid"
      style={{color: 'gray', fontSize: 150}}
    />
  );
};

const ActorCard: React.FC<{actor: Cast}> = ({actor}) => {
  return (
    <View style={{...styles.container}}>
      <View style={{padding: 10}}>
        {actor?.profile_path ? (
          <Image
            source={{uri: `${API_IMAGE_URL}/w500/${actor.profile_path}`}}
            style={styles.image}
            width={200}
            height={250}
          />
        ) : (
          <View style={styles.personContainer}>
            <PersonIcon />
          </View>
        )}
      </View>

      {/* Info */}
      <View>
        <Text numberOfLines={2} style={styles.title}>
          {actor.name}
        </Text>

        <View style={{alignItems: 'center'}}>
          <Text>Como</Text>
          <Text style={{fontWeight: 'bold'}}>{actor.character}</Text>
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
    width: 200,
    height: 250,
  },
  bottomInfo: {
    fontSize: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 6,
  },
  personContainer: {
    justifyContent: 'center',
    aspectRatio: '2/3',
    alignItems: 'center',
    backgroundColor: '#d7d7d7',
    borderRadius: 10,
  },
});

export default ActorCard;
