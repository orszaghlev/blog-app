import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import AdminAllPosts from '../../pages/AdminAllPosts';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import allPostsFixture from '../../fixtures/CreatedAllPosts';
import useAllPosts from '../../hooks/UseAllPosts';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../hooks/UseAllPosts');

describe('<AdminAllPosts />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, de nincsenek bejegyzések', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };
        const { queryByText } = render(
            <Router>
                <FirebaseContext.Provider
                    value={firebase}
                >
                    <AdminAllPosts />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            useAllPosts.mockImplementation(() => ([]));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(queryByText('Összes bejegyzés')).not.toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, a bejegyzések adataival', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };
        const { findByText, queryByText } = render(
            <Router>
                <FirebaseContext.Provider
                    value={firebase}
                >
                    <AdminAllPosts />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            useAllPosts.mockImplementation(() => ([allPostsFixture]));

            expect(queryByText('Összes bejegyzés')).not.toBeInTheDocument();
            expect(await findByText('Összes bejegyzés'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                //expect(queryByText('Összes bejegyzés')).toBeInTheDocument();
            });
        });
    });
})