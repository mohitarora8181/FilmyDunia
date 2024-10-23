import { MovieResponse } from "../types/discover_movies";
import axios from "axios";
//@ts-ignore
import { ACCESS_TOKEN } from "@env";

const BASE_URL = "https://api.themoviedb.org/3";

axios.defaults.headers.common.Authorization = ACCESS_TOKEN;

export const fetchMovies = async (page: number = 1): Promise<MovieResponse> => {
    try {
        const response = await axios.get<MovieResponse>(`${BASE_URL}/movie/popular`, {
            params: {
                page
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch movies: ${error.message}`);
        }
        throw new Error('An unexpected error occurred');
    }
};