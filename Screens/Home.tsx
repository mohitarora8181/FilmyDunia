import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Button,
} from 'react-native';
import { MovieResponse, Movie } from '../types/discover_movies';
import { fetchMovies } from '../controllers/movies';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteMovie, removeFavoriteMovie } from '../redux/reducer.js';
import Icon from 'react-native-vector-icons/MaterialIcons.js';

type MoviesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: MoviesScreenNavigationProp;
};

const MovieList = ({ navigation }: Props) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    const favouritesAdded = useSelector((state: any) => state.favoriteMovies.favoriteMovies);
    const [badgeCount, setBadgeValue] = useState(favouritesAdded.length);
    const loadMovies = async (pageNum: number = 1, refresh: boolean = false) => {
        try {
            setLoading(!refresh);
            const response: MovieResponse = await fetchMovies(pageNum);
            setMovies(response.results);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleAddFavorite = (movie: Movie) => {
        dispatch(addFavoriteMovie(movie));
        setBadgeValue((prev: number) => prev + 1);
    };

    const handleRemoveFavorite = (movie: Movie) => {
        dispatch(removeFavoriteMovie(movie));
        setBadgeValue((prev: number) => prev - 1);
    };

    useEffect(() => {
        navigation.setOptions({
            title: 'Popular Movies',
            headerRight: () => (
                <TouchableOpacity style={{ flexDirection: "row", paddingRight: 15, justifyContent: "center" }} onPress={() => navigation.navigate('Favourites')}>
                    <Icon style={{ paddingRight: 5 }} name='favorite-outline' color={"black"} size={25} />
                    {badgeCount > 0 && (
                        <View>
                            <Text>{badgeCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            )
        })
    }, [badgeCount]);

    useEffect(() => {
        loadMovies();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadMovies(1, true);
    };

    const renderMovie = ({ item }: { item: Movie }) => (
        <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetail', {
                movieId: item.id,
                title: item.title
            })}>
            <Image
                source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
                style={styles.poster}
            />
            <View style={styles.movieInfo}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.overview} numberOfLines={3}>
                    {item.overview}
                </Text>
                <Text style={styles.rating}>
                    Rating: {item.vote_average.toFixed(1)} ⭐
                </Text>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", paddingRight: 10 }}>
                    {
                        favouritesAdded.some((favMovie: Movie) => favMovie.id === item.id) ? (
                            <Icon name="favorite" size={25} onPress={() => handleRemoveFavorite(item)} />
                        ) : (
                            <Icon name="favorite-border" size={25} onPress={() => handleAddFavorite(item)} />
                        )
                    }
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.error}>Error: {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => loadMovies(1, true)}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <FlatList
            data={movies}
            renderItem={renderMovie}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        padding: 20,
        backgroundColor: "black",
        gap: 5
    },
    movieCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    poster: {
        width: 100,
        height: 150,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    movieInfo: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    overview: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    rating: {
        fontSize: 14,
        color: '#666',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default MovieList;