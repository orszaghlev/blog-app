import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Home from '../../pages/Home';
import UserContext from '../../contexts/User';
import FirebaseContext from '../../contexts/Firebase';
import LoggedInUserContext from '../../contexts/LoggedInUser';
import * as ROUTES from '../../constants/Routes';
import { getUserByUserId } from '../../services/Firebase';
import useUser from '../../hooks/UseUser';
import userFixture from '../../fixtures/LoggedInUser';
import postFixture from '../../fixtures/CreatedPost';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../services/Firebase');
jest.mock('../../hooks/UseUser');

describe('<Home />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, de nincsenek bejegyzések', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                    orderBy: jest.fn(() => ({
                        startAfter: jest.fn(() => ({
                            limit: jest.fn(() => ({
                                get: jest.fn(() => ({
                                }))
                            }))
                        }))
                    }))
                }))
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Home />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual('Bejegyzések');
                expect(queryByText('Bejegyzések')).not.toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a bejegyzések adataival', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                    orderBy: jest.fn(() => ({
                        startAfter: jest.fn(() => ({
                            limit: jest.fn(() => ({
                                get: jest.fn(() => Promise.resolve(postFixture))
                            }))
                        }))
                    }))
                }))
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: 'SQ63uFaevONVpZHFAiMyjDbbmI52',
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Home />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual('Bejegyzések');
                //expect(queryByText('Bejegyzések')).toBeInTheDocument();
            });
        });
    });
})