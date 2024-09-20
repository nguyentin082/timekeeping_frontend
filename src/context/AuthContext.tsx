import React, {
    createContext,
    useReducer,
    useMemo,
    useEffect,
    ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null;
};

type AuthAction =
    | { type: 'RESTORE_TOKEN'; token: string | null }
    | { type: 'SIGN_IN'; token: string }
    | { type: 'SIGN_OUT' };

type AuthContextType = {
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    state: AuthState;
} | null;

const initialAuthState: AuthState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case 'SIGN_IN':
            return {
                ...state,
                isSignout: false,
                userToken: action.token,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isSignout: true,
                userToken: null,
            };
        default:
            throw new Error('Invalid action type');
    }
};

export const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                console.log('Running bootstrapAsync');
                const userToken = await AsyncStorage.getItem('@token');
                dispatch({ type: 'RESTORE_TOKEN', token: userToken });
            } catch (e) {
                console.error('Error retrieving token:', e);
                dispatch({ type: 'RESTORE_TOKEN', token: null });
            }
        };

        bootstrapAsync();
    }, []);

    const authContext = useMemo(
        () => ({
            signIn: async (token: string) => {
                try {
                    await AsyncStorage.setItem('@token', token);
                    dispatch({ type: 'SIGN_IN', token });
                } catch (e) {
                    console.error('Error saving token:', e);
                }
            },
            signOut: async () => {
                try {
                    await AsyncStorage.removeItem('@token');
                    dispatch({ type: 'SIGN_OUT' });
                } catch (e) {
                    console.error('Error removing token:', e);
                }
            },
            state,
        }),
        [state]
    );

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};
