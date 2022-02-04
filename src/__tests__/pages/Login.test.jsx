import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Login from '../../pages/Login';
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

describe('<Login />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejelentkezéshez szükséges form, sikeresen bejelentkezik a felhasználó', async () => {
        const succeededToLogin = jest.fn(() => Promise.resolve('Sikeres bejelentkezés!'));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: succeededToLogin
            }))
        };
        const { getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <Login />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev@gmail.com' }
            });
            await fireEvent.change(getByTestId('input-password'), {
                target: { value: 'test1234' }
            });
            fireEvent.submit(getByTestId('login'));

            expect(document.title).toEqual(`Bejelentkezés | ${process.env.REACT_APP_BLOG_NAME}`);

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByTestId('input-email').value).toBe('orszaghlev@gmail.com');
                expect(getByTestId('input-password').value).toBe('test1234');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik a bejelentkezéshez szükséges form, de a felhasználó bejelentkezése sikertelen', async () => {
        jest.useFakeTimers();

        const failToLogin = jest.fn(() => Promise.reject(new Error('Sikertelen bejelentkezés, nem megfelelő e-mail és/vagy jelszó!')));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: failToLogin
            }))
        };
        const { getByTestId, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <Login />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-email'), {
                target: { value: 'orszaghlev.com' }
            });
            await fireEvent.change(getByTestId('input-password'), {
                target: { value: 'test1234' }
            });
            fireEvent.submit(getByTestId('login'));
            jest.advanceTimersByTime(5001);

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByTestId('input-email').value).toBe('');
                expect(getByTestId('input-password').value).toBe('');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('Megjelenik a bejelentkezéshez szükséges form mobilon, de a felhasználó visszalép a kezdőoldalra', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <ResponsiveContext.Provider value={{ width: 300 }}>
                    <FirebaseContext.Provider value={{ firebase }}>
                        <Login />
                    </FirebaseContext.Provider>
                </ResponsiveContext.Provider>
            </Router>
        );

        await act(async () => {
            fireEvent.click(getByTestId('return'));

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });
});