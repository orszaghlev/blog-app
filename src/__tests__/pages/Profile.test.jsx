import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import Profile from '../../pages/Profile';
import UserContext from '../../contexts/User';
import LoggedInUserContext from '../../contexts/LoggedInUser';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { getUserByUserId } from '../../services/Firebase';
import useUser from '../../hooks/UseUser';
import userFixture from '../../fixtures/LoggedInUser';
import userWithNoFavoritesOrCommentsFixture from '../../fixtures/LoggedInUserWithNoFavoritesOrComments';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../services/Firebase');
jest.mock('../../hooks/UseUser');

describe('<Profile />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó rendelkezik kedvenc bejegyzéssel és saját kommenttel', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('Profil')).toBeTruthy();
                expect(getByText('Felhasználó adatai')).toBeTruthy();
                expect(getByText('Felhasználónév: admin')).toBeTruthy();
                expect(getByText('Teljes név: Levente Országh')).toBeTruthy();
                expect(getByText('E-mail cím: orszaghlev@gmail.com')).toBeTruthy();
                expect(getByText('Regisztráció dátuma: 2021. 09. 16. 13:27:57')).toBeTruthy();
                expect(getByText('Kedvenc bejegyzések')).toBeTruthy();
                expect(getByText('JSX (JavaScript)')).toBeTruthy();
                expect(getByText('Saját hozzászólások')).toBeTruthy();
                expect(getByText('Facebook')).toBeTruthy();
                expect(getByText('(Y)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó nem rendelkezik kedvenc bejegyzéssel és saját kommenttel', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userWithNoFavoritesOrCommentsFixture]);
            useUser.mockImplementation(() => ({ user: userWithNoFavoritesOrCommentsFixture }));

            const { getByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(document.title).toEqual('Profil');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('Profil')).toBeTruthy();
                expect(getByText('Felhasználó adatai')).toBeTruthy();
                expect(getByText('Felhasználónév: admin')).toBeTruthy();
                expect(getByText('Teljes név: Levente Országh')).toBeTruthy();
                expect(getByText('E-mail cím: orszaghlev@gmail.com')).toBeTruthy();
                expect(getByText('Regisztráció dátuma: 2021. 09. 16. 13:27:57')).toBeTruthy();
                expect(getByText('Jelenleg nincsenek kedvenc bejegyzései!')).toBeTruthy();
                expect(getByText('Jelenleg nincsenek saját hozzászólásai!')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó az adatok szerkesztése gombra kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('profile-edit'));

            expect(document.title).toEqual('Profil');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.PROFILE_EDIT);
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó a kedvenc bejegyzésére kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('user-favoritePost-button'));

            expect(document.title).toEqual('Profil');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("JSX (JavaScript)")}`);
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó a saját hozzászólásának forrására kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('user-comment-button'));

            expect(document.title).toEqual('Profil');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("Facebook")}`);
            });
        });
    });
});