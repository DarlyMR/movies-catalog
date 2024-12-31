import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import MovieCard from './MovieCard';
import {Movie} from '../utils/interfaces/movie-search';
import {globalStyles} from '../config/theme';

interface MovieGridListProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  title: string;
}

const MovieGridList: React.FC<MovieGridListProps> = ({
  movies,
  loading,
  error,
  onRefresh,
  title,
}) => {
  if (loading && movies.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <Text style={{...globalStyles.title, color: 'white', textAlign: 'center'}}>
        {title}
      </Text>
      <FlatList
        style={styles.flatContainer}
        numColumns={2}
        data={movies}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        renderItem={({item}) => (
          <View style={styles.cardContainer}>
            <MovieCard movie={item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252323',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252323',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
  },
  flatContainer: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    gap: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
  },
});

export default MovieGridList;