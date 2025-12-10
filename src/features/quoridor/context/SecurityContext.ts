import { createContext } from 'react';
import type Keycloak from 'keycloak-js';

export type User = {
    username: string;
    name: string;
    email?: string;
    roles: string[];
    accessToken: string;
    idToken?: string;
};

export type SecurityContext = {
    isInitialised: boolean;
    isAuthenticated: () => boolean;
    loggedInUser: User | undefined;
    login: () => void;
    logout: () => void;
    keycloakInstance: Keycloak | null;
    refreshUserData: (forceTokenRefresh?: boolean) => Promise<void>;
};

export default createContext<SecurityContext>({
    isInitialised: false,
    isAuthenticated: () => false,
    loggedInUser: undefined,
    login: () => {},
    logout: () => {},
    keycloakInstance: null,
    refreshUserData: async () => {},
});