import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import AdminCreatePost from '../../pages/AdminCreatePost';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/routes';

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
                    add: jest.fn(() => Promise.resolve('Bejegyzés létrehozva'))
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
            //await fireEvent.change(getByTestId('input-content'), {
            //    target: { value: "React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with state management and rendering that state to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality. React was created by Jordan Walke, a software engineer at Facebook, who released an early prototype of React called 'FaxJS'. He was influenced by XHP, an HTML component library for PHP. It was first deployed on Facebook's News Feed in 2011 and later on Instagram in 2012. It was open- sourced at JSConf US in May 2013. React Native, which enables native Android, iOS, and UWP development with React, was announced at Facebook's React Conf in February 2015 and open-sourced in March 2015. On April 18, 2017, Facebook announced React Fiber, a new set of internal algorithms for rendering, as opposed to React's old rendering algorithm, Stack.React Fiber was to become the foundation of any future improvements and feature development of the React library.The actual syntax for programming with React does not change; only the way that the syntax is executed has changed.React's old rendering system, Stack, was developed at a time when the focus of the system on dynamic change was not understood. Stack was slow to draw complex animation, for example, trying to accomplish all of it in one chunk. Fiber breaks down animation into segments that can be spread out over multiple frames. Likewise, the structure of a page can be broken into segments that may be maintained and updated separately. JavaScript functions and virtual DOM objects are called 'fibers', and each can be operated and updated separately, allowing for smoother on-screen rendering. On September 26, 2017, React 16.0 was released to the public. On February 16, 2019, React 16.8 was released to the public. The release introduced React Hooks. On August 10, 2020, the React team announced the first release candidate for React v17.0, notable as the first major release without major changes to the React developer-facing API. Source: Wikipedia [CC-BY-SA-3.0] (https://en.wikipedia.org/wiki/React_(JavaScript_library)" }
            //});
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
            //await fireEvent.change(getByTestId('input-date'), {
            //    target: { value: new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
            //})
            fireEvent.submit(getByTestId('create-post'));

            expect(document.title).toEqual('Új bejegyzés');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.ADMIN_ALL_POSTS);
                expect(getByTestId('input-id').value).toBe('react');
                expect(getByTestId('input-title').value).toBe('React (JavaScript library)');
                expect(getByTestId('input-slug').value).toBe('react-javascript-library-');
                expect(getByTestId('input-description').value).toBe('React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components.');
                //expect(getByTestId('input-content').value).toBe("React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with state management and rendering that state to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality. React was created by Jordan Walke, a software engineer at Facebook, who released an early prototype of React called 'FaxJS'. He was influenced by XHP, an HTML component library for PHP. It was first deployed on Facebook's News Feed in 2011 and later on Instagram in 2012. It was open- sourced at JSConf US in May 2013. React Native, which enables native Android, iOS, and UWP development with React, was announced at Facebook's React Conf in February 2015 and open-sourced in March 2015. On April 18, 2017, Facebook announced React Fiber, a new set of internal algorithms for rendering, as opposed to React's old rendering algorithm, Stack.React Fiber was to become the foundation of any future improvements and feature development of the React library.The actual syntax for programming with React does not change; only the way that the syntax is executed has changed.React's old rendering system, Stack, was developed at a time when the focus of the system on dynamic change was not understood. Stack was slow to draw complex animation, for example, trying to accomplish all of it in one chunk. Fiber breaks down animation into segments that can be spread out over multiple frames. Likewise, the structure of a page can be broken into segments that may be maintained and updated separately. JavaScript functions and virtual DOM objects are called 'fibers', and each can be operated and updated separately, allowing for smoother on-screen rendering. On September 26, 2017, React 16.0 was released to the public. On February 16, 2019, React 16.8 was released to the public. The release introduced React Hooks. On August 10, 2020, the React team announced the first release candidate for React v17.0, notable as the first major release without major changes to the React developer-facing API. Source: Wikipedia [CC-BY-SA-3.0] (https://en.wikipedia.org/wiki/React_(JavaScript_library)");
                expect(getByTestId('input-imgURL').value).toBe('https://www.mobinius.com/wp-content/uploads/2019/03/React_Native_Logo.png');
                expect(getByTestId('input-tag').value).toBe('react, javascript, library');
                expect(getByTestId('input-language').value).toBe('English');
                expect(getByTestId('input-isActive').value).toBe('true');
                //expect(getByTestId('input-date').value).toBe(new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
            });
        });
    });

    it('Megjelenik a bejegyzés létrehozásához szükséges form, de az adminiszrátor visszalép az összes bejegyzést tartalmazó oldalra', async () => {
        const firebase = {
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
            fireEvent.click(getByTestId('return'));

            expect(document.title).toEqual('Új bejegyzés');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.ADMIN_ALL_POSTS);
            });
        });
    });
});