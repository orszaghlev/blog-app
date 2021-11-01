import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import ProfileEdit from '../../pages/ProfileEdit';
import UserContext from '../../contexts/User';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { doesUsernameExist, getUserByUserId } from '../../services/Firebase';
import useUser from '../../hooks/UseUser';
import userFixture from '../../fixtures/LoggedInUser';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../services/Firebase');
jest.mock('../../hooks/UseUser');

describe('<ProfileEdit />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a profilszerkesztő oldal, a felhasználó saját adataival', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            })),
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId, queryByTestId } = render(
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
                            <ProfileEdit />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByTestId('input-username').value).toBe('admin');
                expect(getByTestId('input-fullname').value).toBe('Levente Országh');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik a profilszerkesztő oldal, a felhasználó saját adataival, a felhasználó sikeresen szerkesztette azokat', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            })),
            firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                    doc: jest.fn().mockReturnThis(),
                    set: jest.fn(() => Promise.resolve('Felhasználó szerkesztve'))
                }))
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            doesUsernameExist.mockImplementation(() => Promise.resolve(false));

            const { getByTestId, queryByTestId } = render(
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
                            <ProfileEdit />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router >
            );

            await fireEvent.change(getByTestId('input-username'), {
                target: { value: 'admin' }
            });
            await fireEvent.change(getByTestId('input-fullname'), {
                target: { value: 'Levente Orszagh' }
            });
            fireEvent.submit(getByTestId('edit-user-data'));

            expect(document.title).toEqual('Felhasználói adatok szerkesztése');
            await expect(doesUsernameExist).toHaveBeenCalled();
            await expect(doesUsernameExist).toHaveBeenCalledWith('admin');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.PROFILE);
                expect(getByTestId('input-username').value).toBe('admin');
                expect(getByTestId('input-fullname').value).toBe('Levente Orszagh');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik a profilszerkesztő oldal, de a felhasználó visszalép a profiloldalra', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            })),
            firestore: jest.fn(() => ({
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
                            <ProfileEdit />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('return'));

            expect(document.title).toEqual('Felhasználói adatok szerkesztése');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.PROFILE);
            });
        });
    });

    it('Megjelenik a profilszerkesztő oldal, de a felhasználó a jelszóváltoztató gombra kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
                sendPasswordResetEmail: jest.fn(() => Promise.resolve('Küldtünk az Ön e-mail címére egy jelszóváltoztatást segítő mailt!'))
            })),
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByText, getByTestId, queryByTestId } = render(
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
                            <ProfileEdit />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('change-password'));

            expect(document.title).toEqual('Felhasználói adatok szerkesztése');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.PROFILE);
                expect(getByText('Küldtünk az Ön e-mail címére egy jelszóváltoztatást segítő mailt!')).toBeTruthy();
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });
});