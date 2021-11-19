import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import NotFound from '../../pages/NotFound';
import FirebaseContext from '../../contexts/Firebase';
import UserContext from '../../contexts/User';
import * as ROUTES from '../../constants/Routes';

const mockHistoryPush = jest.fn();
const firebase = {
    auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() =>
            Promise.resolve({
                user: { updateProfile: jest.fn(() => Promise.resolve('Bejelentkezett felhasználó')) }
            })
        )
    }))
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

describe('<NotFound />', () => {
    it('Van bejelentkezett felhasználónk, de nem megfelelő aloldalon jár', async () => {
        jest.useFakeTimers();

        const { getByText } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <UserContext.Provider value={{ user: {} }}>
                        <NotFound />
                    </UserContext.Provider>
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            jest.advanceTimersByTime(5001);

            await waitFor(() => {
                expect(getByText('A keresett oldal nem található!')).toBeTruthy();
                expect(document.title).toEqual(`404 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('A vendég nincsen bejelentkezve és nem megfelelő aloldalon jár, a kezdőlapra tér vissza', async () => {
        jest.useFakeTimers();
        
        const { findByTestId, getByText } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <UserContext.Provider value={{ user: null }}>
                        <NotFound />
                    </UserContext.Provider>
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            jest.advanceTimersByTime(5001);
            fireEvent.click(await findByTestId('not-found-return'));

            await waitFor(() => {
                expect(getByText('A keresett oldal nem található!')).toBeTruthy();
                expect(document.title).toEqual(`404 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });
});