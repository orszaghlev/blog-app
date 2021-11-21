import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import ForgotPassword from '../../pages/ForgotPassword';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { Context as ResponsiveContext } from 'react-responsive';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

describe('<ForgotPassword />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik az elfelejtett jelszó aloldal, sikeresen visszaállítja a jelszavát a felhasználó', async () => {
        const firebase = {
            auth: jest.fn(() => ({
                sendPasswordResetEmail: jest.fn(() => Promise.resolve('A megadott e-mail címre kiküldtünk egy jelszó visszaállítást segítő mailt!'))
            }))
        };
        const { getByText, getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <ForgotPassword />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev@gmail.com' }
            });
            fireEvent.submit(getByTestId('forgot-password'));

            expect(document.title).toEqual(`Elfelejtett jelszó | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.LOGIN);
                expect(getByTestId('input-email').value).toBe('orszaghlev@gmail.com');
                expect(queryByTestId('error')).toBeFalsy();
                expect(getByText('A megadott e-mail címre kiküldtünk egy jelszó visszaállítást segítő mailt!')).toBeTruthy();
            });
        });
    });

    it('Megjelenik az elfelejtett jelszó aloldal, de a jelszó visszaállítása sikertelen', async () => {
        jest.useFakeTimers();

        const firebase = {
            auth: jest.fn(() => ({
                sendPasswordResetEmail: jest.fn(() => Promise.reject(new Error('A megadott e-mail címmel még nem regisztrált felhasználó!')))
            }))
        };
        const { getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <ForgotPassword />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev.com' }
            });
            fireEvent.submit(getByTestId('forgot-password'));
            jest.advanceTimersByTime(5001);

            expect(document.title).toEqual(`Elfelejtett jelszó | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByTestId('input-email').value).toBe('');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik az elfelejtett jelszó aloldal mobilon, de a felhasználó visszalép a bejelentkezés aloldalra', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <ResponsiveContext.Provider value={{ width: 300 }}>
                    <FirebaseContext.Provider value={{ firebase }}>
                        <ForgotPassword />
                    </FirebaseContext.Provider>
                </ResponsiveContext.Provider>
            </Router>
        );

        await act(async () => {
            fireEvent.click(getByTestId('return'));

            expect(document.title).toEqual(`Elfelejtett jelszó | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.LOGIN);
            });
        });
    });
});