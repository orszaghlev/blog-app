import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import SignUp from '../../pages/SignUp';
import FirebaseContext from '../../contexts/Firebase';
import { doesUsernameExist, doesEmailAddressExist } from '../../services/Firebase';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../services/Firebase');

describe('<SignUp />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a regisztrációhoz szükséges form, sikeresen regisztrál a felhasználó', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                    add: jest.fn(() => Promise.resolve('Felhasználó hozzáadva'))
                }))
            })),
            auth: jest.fn(() => ({
                createUserWithEmailAndPassword: jest.fn(() => ({
                    user: { updateProfile: jest.fn(() => Promise.resolve('Sikeres regisztráció!')) }
                }))
            }))
        };
        const { getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <SignUp />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            doesUsernameExist.mockImplementation(() => Promise.resolve(true));
            doesEmailAddressExist.mockImplementation(() => Promise.resolve(true));

            await fireEvent.change(getByTestId('input-username'), { target: { value: 'admin' } });
            await fireEvent.change(getByTestId('input-fullname'), {
                target: { value: 'Levente Országh' }
            });
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev@gmail.com' }
            });
            await fireEvent.change(getByTestId('input-password'), { target: { value: 'test1234' } });
            fireEvent.submit(getByTestId('sign-up'));

            expect(document.title).toEqual('Regisztráció');
            await expect(doesUsernameExist).toHaveBeenCalled();
            await expect(doesUsernameExist).toHaveBeenCalledWith('admin');
            await expect(doesEmailAddressExist).toHaveBeenCalled();
            await expect(doesEmailAddressExist).toHaveBeenCalledWith('orszaghlev@gmail.com');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.PROFILE);
                expect(getByTestId('input-username').value).toBe('admin');
                expect(getByTestId('input-fullname').value).toBe('Levente Országh');
                expect(getByTestId('input-email').value).toBe('orszaghlev@gmail.com');
                expect(getByTestId('input-password').value).toBe('test1234');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik a regisztrációhoz szükséges form, de regisztráltak már a megadott felhasználónévvel', async () => {
        const firebase = {
            auth: jest.fn(() => ({
                createUserWithEmailAndPassword: jest.fn(() => ({
                    user: {
                        updateProfile: jest.fn(() => Promise.resolve({}))
                    }
                }))
            }))
        };
        const { getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <SignUp />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            doesUsernameExist.mockImplementation(() => Promise.resolve([false]));

            await fireEvent.change(getByTestId('input-username'), { target: { value: 'admin' } });
            await fireEvent.change(getByTestId('input-fullname'), {
                target: { value: 'Levente Országh' }
            });
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev@gmail.com' }
            });
            await fireEvent.change(getByTestId('input-password'), { target: { value: 'test1234' } });
            fireEvent.submit(getByTestId('sign-up'));

            expect(document.title).toEqual('Regisztráció');
            await expect(doesUsernameExist).toHaveBeenCalled();
            await expect(doesUsernameExist).toHaveBeenCalledWith('admin');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.PROFILE);
                expect(getByTestId('input-username').value).toBe('');
                expect(getByTestId('input-fullname').value).toBe('');
                expect(getByTestId('input-email').value).toBe('');
                expect(getByTestId('input-password').value).toBe('');
                expect(queryByTestId('error')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a regisztrációs form, de hiba következik be', async () => {
        const firebase = {
            auth: jest.fn(() => ({
                createUserWithEmailAndPassword: jest.fn(() => ({
                    user: {
                        updateProfile: jest.fn(() => Promise.reject(new Error('Már regisztráltak ezzel a felhasználónévvel és/vagy e-mail címmel!')))
                    }
                }))
            }))
        };
        const { getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <SignUp />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            doesUsernameExist.mockImplementation(() => Promise.resolve(false));
            doesEmailAddressExist.mockImplementation(() => Promise.resolve(false));

            await fireEvent.change(getByTestId('input-username'), { target: { value: 'admin' } });
            await fireEvent.change(getByTestId('input-fullname'), {
                target: { value: 'Levente Országh' }
            });
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev@gmail.com' }
            });
            await fireEvent.change(getByTestId('input-password'), { target: { value: 'test1234' } });
            fireEvent.submit(getByTestId('sign-up'));

            expect(document.title).toEqual('Regisztráció');
            await expect(doesUsernameExist).toHaveBeenCalled();
            await expect(doesUsernameExist).toHaveBeenCalledWith('admin');
            await expect(doesEmailAddressExist).toHaveBeenCalled();
            await expect(doesEmailAddressExist).toHaveBeenCalledWith('orszaghlev@gmail.com');

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.PROFILE);
                expect(getByTestId('input-username').value).toBe('');
                expect(getByTestId('input-fullname').value).toBe('');
                expect(getByTestId('input-email').value).toBe('');
                expect(getByTestId('input-password').value).toBe('');
                expect(queryByTestId('error')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a regisztrációhoz szükséges form, de a felhasználó visszalép a kezdőoldalra', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <SignUp />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            fireEvent.click(getByTestId('return'));

            expect(document.title).toEqual('Regisztráció');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });
});