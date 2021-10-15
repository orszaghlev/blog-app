import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import Profile from '../../pages/Profile';
import UserContext from '../../contexts/User';
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
        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                auth: jest.fn(() => ({
                                }))
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <Profile />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(document.title).toEqual('Profil');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getUserByUserId).toHaveBeenCalled();
                expect(getUserByUserId).toHaveBeenCalledWith('SQ63uFaevONVpZHFAiMyjDbbmI52');
                expect(getByTestId('profile-title').value).toBe('Profil');
                expect(getByTestId('user-data').value).toBe('Felhasználó adatai');
                expect(getByTestId('user-username').value).toBe('Felhasználónév: admin');
                expect(getByTestId('user-fullname').value).toBe('Teljes név: Levente Országh');
                expect(getByTestId('user-email').value).toBe('E-mail cím: orszaghlev@gmail.com');
                expect(getByTestId('user-date').value).toBe('Regisztráció dátuma: 2021. 09. 16. 13:27:57');
                expect(getByTestId('user-favoritePosts-title').value).toBe('Kedvenc bejegyzések');
                expect(getByTestId('user-favoritePost-title').value).toBe('JSX (JavaScript)');
                expect(getByTestId('user-comments-title').value).toBe('Saját hozzászólások');
                expect(getByTestId('user-comment-title').value).toBe('Facebook');
                expect(getByTestId('user-comment-comment').value).toBe('(Y)');
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó nem rendelkezik kedvenc bejegyzéssel és saját kommenttel', async () => {
        await act(async () => {
            getUserByUserId.mockImplementation(() => [userWithNoFavoritesOrCommentsFixture]);
            useUser.mockImplementation(() => ({ user: userWithNoFavoritesOrCommentsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                auth: jest.fn(() => ({
                                }))
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <Profile />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(document.title).toEqual('Profil');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getUserByUserId).toHaveBeenCalled();
                expect(getUserByUserId).toHaveBeenCalledWith('SQ63uFaevONVpZHFAiMyjDbbmI52');
                expect(getByTestId('profile-title').value).toBe('Profil');
                expect(getByTestId('user-data').value).toBe('Felhasználó adatai');
                expect(getByTestId('user-username').value).toBe('Felhasználónév: admin');
                expect(getByTestId('user-fullname').value).toBe('Teljes név: Levente Országh');
                expect(getByTestId('user-email').value).toBe('E-mail cím: orszaghlev@gmail.com');
                expect(getByTestId('user-date').value).toBe('Regisztráció dátuma: 2021. 09. 16. 13:27:57');
                expect(getByTestId('user-favoritePosts-title').value).toBe('Jelenleg nincsenek kedvenc bejegyzései!');
                expect(getByTestId('user-comments-title').value).toBe('Jelenleg nincsenek saját hozzászólásai!');
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó az adatok szerkesztése gombra kattint', async () => {
        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                auth: jest.fn(() => ({
                                }))
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <Profile />
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
        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                auth: jest.fn(() => ({
                                }))
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <Profile />
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
        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                auth: jest.fn(() => ({
                                }))
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <Profile />
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