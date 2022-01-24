import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import AdminCreatePost from '../../pages/AdminCreatePost';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/routes';
import { Context as ResponsiveContext } from 'react-responsive';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

describe('<AdminCreatePost />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejegyzés létrehozásához szükséges form, sikeresen létrehozza a bejegyzést az adminisztrátor', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                    doc: jest.fn().mockReturnThis(),
                    set: jest.fn(() => Promise.resolve('Bejegyzés létrehozva'))
                }))
            })),
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <AdminCreatePost />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-id'), {
                target: { value: 'react' }
            });
            await fireEvent.change(getByTestId('input-title'), {
                target: { value: 'React (JavaScript library)' }
            });
            await fireEvent.change(getByTestId('input-slug'), {
                target: { value: 'react-javascript-library-' }
            });
            await fireEvent.change(getByTestId('input-description'), {
                target: { value: 'React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components.' }
            });
            await fireEvent.change(getByTestId('input-imgURL'), {
                target: { value: 'https://www.mobinius.com/wp-content/uploads/2019/03/React_Native_Logo.png' }
            })
            await fireEvent.change(getByTestId('input-tag'), {
                target: { value: 'react, javascript, library' }
            })
            await fireEvent.change(getByTestId('input-language'), {
                target: { value: 'English' }
            })
            await fireEvent.change(getByTestId('input-isActive'), {
                target: { value: 'true' }
            })
            fireEvent.submit(getByTestId('create-post'));

            expect(document.title).toEqual(`Új bejegyzés | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD);
                expect(getByTestId('input-id').value).toBe('react');
                expect(getByTestId('input-title').value).toBe('React (JavaScript library)');
                expect(getByTestId('input-slug').value).toBe('react-javascript-library-');
                expect(getByTestId('input-description').value).toBe('React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components.');
                expect(getByTestId('input-imgURL').value).toBe('https://www.mobinius.com/wp-content/uploads/2019/03/React_Native_Logo.png');
                expect(getByTestId('input-tag').value).toBe('react, javascript, library');
                expect(getByTestId('input-language').value).toBe('English');
                expect(getByTestId('input-isActive').value).toBe('true');
            });
        });
    });

    it('Megjelenik a bejegyzés létrehozásához szükséges form, dátumot az adminisztrátor ad meg', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
                collection: jest.fn(() => ({
                    doc: jest.fn().mockReturnThis(),
                    set: jest.fn(() => Promise.resolve('Bejegyzés létrehozva'))
                }))
            })),
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <AdminCreatePost />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            await fireEvent.change(getByTestId('input-date'), {
                target: { value: '2021-09-16T13:27:57.000' }
            })
            fireEvent.submit(getByTestId('create-post'));

            await waitFor(() => {
                expect(getByTestId('input-date').value).toBe('2021-09-16T13:27:57.000');
            });
        });
    });

    it('Megjelenik a bejegyzés létrehozásához szükséges form mobilon, de az adminisztrátor visszalép az admin felületre', async () => {
        document.body.className = "dark-mode";

        const firebase = {
            auth: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <ResponsiveContext.Provider value={{ width: 300 }}>
                    <FirebaseContext.Provider value={{ firebase }}>
                        <AdminCreatePost />
                    </FirebaseContext.Provider>
                </ResponsiveContext.Provider>
            </Router>
        );

        await act(async () => {
            fireEvent.click(getByTestId('return'));

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD);
            });
        });
    });
});