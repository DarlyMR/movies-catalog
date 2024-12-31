import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  votesAverage: number;
  textColor?: string;
}

const StarIcon = () => {
  return <FontAwesome6 style={styles.star} name={'star'} iconStyle="solid" />;
};
const Star = ({votesAverage, textColor}: Props) => {
  return (
    <View style={styles.innerInfo}>
      <Text style={{...styles.rate, color: textColor}}>
        {votesAverage.toFixed(1)}/10
      </Text>
      <StarIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    color: '#fab129',
    borderColor: 'black',
    fontSize: 20,
  },
  innerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rate: {fontWeight: 'bold', marginRight: 3},
});

export default Star;
