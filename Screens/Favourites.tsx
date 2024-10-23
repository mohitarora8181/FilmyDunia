import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Movie } from '../types/discover_movies';
import { useSelector } from 'react-redux';

const Favourites = ({ navigation }: any) => {
    const movies = useSelector((state: any) => state.favoriteMovies.favoriteMovies);
    const movies_list = movies.length % 2 === 1 ? [...movies, { id: 'spacer' }] : movies;

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <TouchableOpacity
            style={styles.movieItem}
            onPress={() => navigation.navigate('MovieDetail', {
                movieId: item.id,
                title: item.title
            })}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={movies_list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    if (item.id === 'spacer') {
                        return <View style={[styles.dummy, styles.spacer]} />;
                    } else {
                        return renderMovieItem({ item });
                    }
                }}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: 'black',
        padding: 20
    },
    row: {
        justifyContent: 'space-between',
    },
    movieItem: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        borderColor: "gray",
        borderWidth: 0.8,
        padding: 5,
        borderRadius: 20
    },
    poster: {
        width: Dimensions.get('window').width / 2.5,
        height: 200,
        borderRadius: 10,
    },
    title: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: "white"
    },
    spacer: {
        backgroundColor: 'transparent',
    },
    dummy: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
    },
});

export default Favourites;
