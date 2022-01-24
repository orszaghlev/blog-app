import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import NotFound from '../../pages/NotFound';
import * as ROUTES from '../../constants/Routes';
import { Context as ResponsiveContext } from 'react-responsive';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

describe('<NotFound />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('A vendég nem megfelelő aloldalon jár mobilon', async () => {
        jest.useFakeTimers();

        const { getByText } = render(
            <Router>
                <ResponsiveContext.Provider value={{ width: 300 }}>
                    <NotFound />
                </ResponsiveContext.Provider>
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

    it('A vendég nem megfelelő aloldalon jár, a kezdőlapra tér vissza', async () => {
        jest.useFakeTimers();

        const { findByTestId } = render(
            <Router>
                <NotFound />
            </Router>
        );

        await act(async () => {
            jest.advanceTimersByTime(5001);
            fireEvent.click(await findByTestId('not-found-return'));

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });
});