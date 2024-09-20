import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserData = {
    id: number;
    name: string;
    email: string;
    date_of_birth: string;
    position: string;
    last_status: string;
    company_name: string;
};

type UserContextType = {
    userData: UserData | null;
    setUserData: (data: UserData | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
