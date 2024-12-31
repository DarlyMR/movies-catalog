import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import {Movie} from '../interfaces/movie-search';

interface AppContextValue {
  sessionId: string;
  setSessionId: Dispatch<SetStateAction<string>>;
  // favoriteMovies: Movie[];
  // setFavoriteMovies: Dispatch<SetStateAction<Movie[]>>;
  favoriteMovieIds: number[];
  setFavoriteMovieIds: Dispatch<SetStateAction<number[]>>;
}

const defaultState: AppContextValue = {
  sessionId: '',
  setSessionId: () => {},
  // favoriteMovies: [],
  // setFavoriteMovies: () => {},
  favoriteMovieIds: [],
  setFavoriteMovieIds: () => {},
};

export const Context = createContext(defaultState);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [sessionId, setSessionId] = useState('');
  // const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState<number[]>([]);

  const contextValue: AppContextValue = {
    sessionId,
    setSessionId,
    // favoriteMovies,
    // setFavoriteMovies,
    favoriteMovieIds,
    setFavoriteMovieIds,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
