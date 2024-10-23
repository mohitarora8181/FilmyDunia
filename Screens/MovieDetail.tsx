// components/MovieDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Linking,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import axios from 'axios';

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

type Props = {
  route: MovieDetailScreenRouteProp;
};

interface MovieDetails {
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
}

const MovieDetail = ({ route }: Props) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const API_KEY = 'your_api_key'; // Use your TMDB API key
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${route.params.movieId}?api_key=${API_KEY}`
        );
        setMovie(response.data);
      } catch (error) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [route.params.movieId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Failed to load movie'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}
        style={styles.backdrop}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
        <Text style={styles.releaseDate}>
          Release Date: {new Date(movie.release_date).toLocaleDateString()}
        </Text>
        <Text style={styles.runtime}>
          Runtime: {movie.runtime} minutes
        </Text>
        <Text style={styles.genres}>
          Genres: {movie.genres.map(g => g.name).join(', ')}
        </Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Button
          title='Download Movie'
          color={"black"}
          onPress={()=>{
            Linking.openURL(`https://www.google.com/search?q=${movie.title}&as_sitesearch=www.filmyzilla.com.cv`);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  runtime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  genres: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom:30
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default MovieDetail;