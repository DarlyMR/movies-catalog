import React from 'react';
import {Text} from 'react-native';
interface Props {
  text: string;
}
const Title = ({text}: Props) => {
  return <Text>{text}</Text>;
};

export default Title;
