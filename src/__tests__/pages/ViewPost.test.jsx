import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import ViewPost from '../../pages/ViewPost';
import UserContext from '../../contexts/User';
import FirebaseContext from '../../contexts/Firebase';
import LoggedInUserContext from '../../contexts/LoggedInUser';
import * as ROUTES from '../../constants/Routes';
import { getUserByUserId, getPostByPostSlug } from '../../services/Firebase';
import useUser from '../../hooks/UseUser';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';
import usePost from '../../hooks/UsePost';
import userFixture from '../../fixtures/LoggedInUser';
import userNotAdminFixture from '../../fixtures/LoggedInUserWithNoAdminAccess';
import userNotAdminEndsWithSFixture from '../../fixtures/LoggedInUserWithNoAdminAccessWhoseNameEndsWithS';
import postFixture from '../../fixtures/CreatedPost';
import postFixtureHun from '../../fixtures/CreatedPostHun';
import postFixtureWithComment from '../../fixtures/CreatedPostWithComment';
import postFixtureWithCommentHun from '../../fixtures/CreatedPostWithCommentHun';
import postFixtureWithUserComment from '../../fixtures/CreatedPostWithUserComment';
import postFixtureWithUserCommentHun from '../../fixtures/CreatedPostWithUserCommentHun';
import postFixtureWithUserCommentEndsWithS from '../../fixtures/CreatedPostWithUserCommentWhoseNameEndsWithS';
import postFixtureInactive from '../../fixtures/CreatedInactivePost';
import postFixtureInactiveHun from '../../fixtures/CreatedInactivePostHun';
import { Context as ResponsiveContext } from 'react-responsive';

const mockHistoryPush = jest.fn();

jest.mock('../../services/Firebase');
jest.mock('../../hooks/UseUser');
jest.mock('../../hooks/UseUserWhoCommented');
jest.mock('../../hooks/UsePost');

describe('<ViewPost />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal mobilon, a bejegyzéshez tartozó adatokkal', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByText } = render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
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
                                <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                    <ViewPost />
                                </LoggedInUserContext.Provider>
                            </UserContext.Provider>
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('2021. 10. 07. 13:00')).toBeTruthy();
                expect(getByText('React (JavaScript library)')).toBeTruthy();
                expect(getByText('React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components.')).toBeTruthy();
                expect(getByText("React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with state management and rendering that state to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality. React was created by Jordan Walke, a software engineer at Facebook, who released an early prototype of React called 'FaxJS'. He was influenced by XHP, an HTML component library for PHP. It was first deployed on Facebook's News Feed in 2011 and later on Instagram in 2012. It was open-sourced at JSConf US in May 2013. React Native, which enables native Android, iOS, and UWP development with React, was announced at Facebook's React Conf in February 2015 and open-sourced in March 2015. On April 18, 2017, Facebook announced React Fiber, a new set of internal algorithms for rendering, as opposed to React's old rendering algorithm, Stack. React Fiber was to become the foundation of any future improvements and feature development of the React library. The actual syntax for programming with React does not change; only the way that the syntax is executed has changed. React's old rendering system, Stack, was developed at a time when the focus of the system on dynamic change was not understood. Stack was slow to draw complex animation, for example, trying to accomplish all of it in one chunk. Fiber breaks down animation into segments that can be spread out over multiple frames. Likewise, the structure of a page can be broken into segments that may be maintained and updated separately. JavaScript functions and virtual DOM objects are called 'fibers', and each can be operated and updated separately, allowing for smoother on-screen rendering. On September 26, 2017, React 16.0 was released to the public. On February 16, 2019, React 16.8 was released to the public. The release introduced React Hooks. On August 10, 2020, the React team announced the first release candidate for React v17.0, notable as the first major release without major changes to the React developer-facing API. Source: Wikipedia [CC-BY-SA-3.0] (https://en.wikipedia.org/wiki/React_(JavaScript_library)")).toBeTruthy();
                expect(getByText('Add to favorites')).toBeTruthy();
                expect(getByText('Return')).toBeTruthy();
                expect(getByText('There are no comments yet!')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureHun]);
            usePost.mockImplementation(() => ({ post: postFixtureHun }));

            const { getByText } = render(
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
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('2021. 10. 07. 14:00')).toBeTruthy();
                expect(getByText('HTML5')).toBeTruthy();
                expect(getByText('Címke: html5')).toBeTruthy();
                expect(getByText('A HTML5 a HTML (Hypertext Markup Language, a web fő jelölőnyelve) korábbi verzióinak az átdolgozott változata.')).toBeTruthy();
                expect(getByText("A HTML5 a HTML (Hypertext Markup Language, a web fő jelölőnyelve) korábbi verzióinak az átdolgozott változata. A kifejlesztésének egyik fő célja, hogy a webes alkalmazásokhoz ne legyen szükség pluginek (pl. Adobe Flash, Microsoft Silverlight, Oracle JavaFX) telepítésére. A specifikáció a HTML4 és az XHTML1 új verzióját jelenti, a hozzájuk tartozó DOM2 HTML API-val együtt. A HTML5 specifikációban leírt formátumba történő migráció HTML4-ről, vagy XHTML1-ről a legtöbb esetben egyszerű, mivel a visszamenőleges kompatibilitás biztosított. A specifikáció a közeljövőben támogatni fogja a Web Forms 2.0 specifikációt is. A HTML5 bevezet jó néhány új elemet (címkét) és tulajdonságot, amelyek a modern weblapokon jellemzően alkalmazott szerkezetekre kínálnak új megoldást. Néhány változtatás szemantikai jellegű, például az általánosan használt div és a soron belüli részek formázását biztosító span helyett a nav (a weboldal navigációs területe) és a footer (lábléc). Más elemek új funkciók elérését biztosítják szabványosított felületen, mint az audio és a video elemek. Néhány a HTML 4.01-ben már érvénytelenített elem az új szabványba már nem került be. Ilyenek a mai weblapokon még gyakran jelenlévő font és center elemek, amelyek hatását most már végleg CSS kóddal kell megvalósítani. Újra hangsúlyt helyeztek a DOM szkriptek (gyakorlatilag a JavaScript) jelentőségére a weboldalak viselkedésével kapcsolatban. A jelölések hasonlósága ellenére a HTML5 szintaxisa már nem az SGML-en alapul. Ezzel együtt úgy tervezték, hogy visszafelé kompatibilis legyen, így a korábbi HTML szabványokhoz készült elemzők a szokásos elemeket megérthetik. Forrás: Wikipédia [CC-BY-SA-3.0] (https://hu.wikipedia.org/wiki/HTML5)")).toBeTruthy();
                expect(getByText('Hozzáadás a kedvencekhez')).toBeTruthy();
                expect(getByText('Vissza')).toBeTruthy();
                expect(getByText('Jelenleg nincsenek hozzászólások!')).toBeTruthy();
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal és kommentekkel', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { getByText } = render(
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
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('2021. 10. 07. 13:00')).toBeTruthy();
                expect(getByText('React (JavaScript library)')).toBeTruthy();
                expect(getByText('React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components.')).toBeTruthy();
                expect(getByText("React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with state management and rendering that state to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality. React was created by Jordan Walke, a software engineer at Facebook, who released an early prototype of React called 'FaxJS'. He was influenced by XHP, an HTML component library for PHP. It was first deployed on Facebook's News Feed in 2011 and later on Instagram in 2012. It was open-sourced at JSConf US in May 2013. React Native, which enables native Android, iOS, and UWP development with React, was announced at Facebook's React Conf in February 2015 and open-sourced in March 2015. On April 18, 2017, Facebook announced React Fiber, a new set of internal algorithms for rendering, as opposed to React's old rendering algorithm, Stack. React Fiber was to become the foundation of any future improvements and feature development of the React library. The actual syntax for programming with React does not change; only the way that the syntax is executed has changed. React's old rendering system, Stack, was developed at a time when the focus of the system on dynamic change was not understood. Stack was slow to draw complex animation, for example, trying to accomplish all of it in one chunk. Fiber breaks down animation into segments that can be spread out over multiple frames. Likewise, the structure of a page can be broken into segments that may be maintained and updated separately. JavaScript functions and virtual DOM objects are called 'fibers', and each can be operated and updated separately, allowing for smoother on-screen rendering. On September 26, 2017, React 16.0 was released to the public. On February 16, 2019, React 16.8 was released to the public. The release introduced React Hooks. On August 10, 2020, the React team announced the first release candidate for React v17.0, notable as the first major release without major changes to the React developer-facing API. Source: Wikipedia [CC-BY-SA-3.0] (https://en.wikipedia.org/wiki/React_(JavaScript_library)")).toBeTruthy();
                expect(getByText('Add to favorites')).toBeTruthy();
                expect(getByText('Return')).toBeTruthy();
                expect(getByText('Comments')).toBeTruthy();
                expect(getByText('(Y)')).toBeTruthy();
                expect(getByText('admin (edited)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal és kommentekkel', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithCommentHun }));

            const { getByText } = render(
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
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('2021. 10. 07. 14:00')).toBeTruthy();
                expect(getByText('HTML5')).toBeTruthy();
                expect(getByText('Címke: html5')).toBeTruthy();
                expect(getByText('A HTML5 a HTML (Hypertext Markup Language, a web fő jelölőnyelve) korábbi verzióinak az átdolgozott változata.')).toBeTruthy();
                expect(getByText("A HTML5 a HTML (Hypertext Markup Language, a web fő jelölőnyelve) korábbi verzióinak az átdolgozott változata. A kifejlesztésének egyik fő célja, hogy a webes alkalmazásokhoz ne legyen szükség pluginek (pl. Adobe Flash, Microsoft Silverlight, Oracle JavaFX) telepítésére. A specifikáció a HTML4 és az XHTML1 új verzióját jelenti, a hozzájuk tartozó DOM2 HTML API-val együtt. A HTML5 specifikációban leírt formátumba történő migráció HTML4-ről, vagy XHTML1-ről a legtöbb esetben egyszerű, mivel a visszamenőleges kompatibilitás biztosított. A specifikáció a közeljövőben támogatni fogja a Web Forms 2.0 specifikációt is. A HTML5 bevezet jó néhány új elemet (címkét) és tulajdonságot, amelyek a modern weblapokon jellemzően alkalmazott szerkezetekre kínálnak új megoldást. Néhány változtatás szemantikai jellegű, például az általánosan használt div és a soron belüli részek formázását biztosító span helyett a nav (a weboldal navigációs területe) és a footer (lábléc). Más elemek új funkciók elérését biztosítják szabványosított felületen, mint az audio és a video elemek. Néhány a HTML 4.01-ben már érvénytelenített elem az új szabványba már nem került be. Ilyenek a mai weblapokon még gyakran jelenlévő font és center elemek, amelyek hatását most már végleg CSS kóddal kell megvalósítani. Újra hangsúlyt helyeztek a DOM szkriptek (gyakorlatilag a JavaScript) jelentőségére a weboldalak viselkedésével kapcsolatban. A jelölések hasonlósága ellenére a HTML5 szintaxisa már nem az SGML-en alapul. Ezzel együtt úgy tervezték, hogy visszafelé kompatibilis legyen, így a korábbi HTML szabványokhoz készült elemzők a szokásos elemeket megérthetik. Forrás: Wikipédia [CC-BY-SA-3.0] (https://hu.wikipedia.org/wiki/HTML5)")).toBeTruthy();
                expect(getByText('Hozzáadás a kedvencekhez')).toBeTruthy();
                expect(getByText('Vissza')).toBeTruthy();
                expect(getByText('Hozzászólások')).toBeTruthy();
                expect(getByText('(Y)')).toBeTruthy();
                expect(getByText('admin (szerkesztve)')).toBeTruthy();
            });
        });
    });

    it('Nem jelenik meg az angol bejegyzéshez tartozó aloldal, mert inaktív a bejegyzés', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureInactive]);
            usePost.mockImplementation(() => ({ post: postFixtureInactive }));

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
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Nem jelenik meg a magyar bejegyzéshez tartozó aloldal, mert inaktív a bejegyzés', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureInactiveHun]);
            usePost.mockImplementation(() => ({ post: postFixtureInactiveHun }));

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
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó elmenti a kedvencek közé a bejegyzést', async () => {
        jest.useFakeTimers();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Added to favorites'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn(),
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('add-to-favorites'));
            jest.advanceTimersByTime(5001);

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('Remove from favorites')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó elmenti a kedvencek közé a bejegyzést', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureHun]);
            usePost.mockImplementation(() => ({ post: postFixtureHun }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Hozzáadva a kedvencekhez'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn(),
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('add-to-favorites'));

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
                expect(getByText('Eltávolítás a kedvencek közül')).toBeTruthy();
                expect(getByText('Sikeres hozzáadás!')).toBeTruthy();
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, de a felhasználó visszalép a kezdőoldalra', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('show-post-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByText('Return')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, de a felhasználó visszalép a kezdőoldalra', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureHun]);
            usePost.mockImplementation(() => ({ post: postFixtureHun }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('show-post-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByText('Vissza')).toBeTruthy();
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó hozzászól a bejegyzéshez', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Added comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await fireEvent.change(getByTestId('input-add-comment'), {
                target: { value: '(Y)' }
            });
            fireEvent.submit(getByTestId('add-comment-submit'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByText('Comments')).toBeTruthy();
                expect(getByText('(Y)')).toBeTruthy();
                expect(getByText('admin')).toBeTruthy();
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó semmit sem szól hozzá a bejegyzéshez', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Added comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await fireEvent.change(getByTestId('input-add-comment'), {
                target: { value: '' }
            });
            fireEvent.submit(getByTestId('add-comment-submit'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-add-comment').value).toBe('');
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törli az egyik hozzászólást', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Deleted comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-delete'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné az egyik hozzászólást, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
                        <FirebaseContext.Provider
                            value={{
                                firebase: {
                                    firestore: jest.fn(() => ({
                                        collection: jest.fn(() => ({
                                            doc: jest.fn(() => ({
                                                update: jest.fn(() => Promise.resolve('Deleted comment'))
                                            }))
                                        }))
                                    }))
                                },
                                FieldValue: {
                                    arrayRemove: jest.fn()
                                }
                            }}
                        >
                            <UserContext.Provider
                                value={{
                                    user: {
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }
                                }}
                            >
                                <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                    <ViewPost />
                                </LoggedInUserContext.Provider>
                            </UserContext.Provider>
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné más hozzászólását, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserComment }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Deleted comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné más hozzászólását, akinek a neve s-re végződik, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminEndsWithSFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentEndsWithS]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentEndsWithS }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Deleted comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné más hozzászólását, akinek a neve s-re végződik, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminEndsWithSFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentHun }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Hozzászólás törölve'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené az egyik hozzászólást, de semmit nem ír be', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByText, getByTestId, queryByTestId } = render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
                        <FirebaseContext.Provider
                            value={{
                                firebase: {
                                    firestore: jest.fn(() => ({
                                        collection: jest.fn(() => ({
                                            doc: jest.fn(() => ({
                                                update: jest.fn(() => Promise.resolve('Edited comment'))
                                            }))
                                        }))
                                    }))
                                },
                                FieldValue: {
                                    arrayUnion: jest.fn(),
                                    arrayRemove: jest.fn()
                                }
                            }}
                        >
                            <UserContext.Provider
                                value={{
                                    user: {
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }
                                }}
                            >
                                <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                    <ViewPost />
                                </LoggedInUserContext.Provider>
                            </UserContext.Provider>
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            );

            expect(queryByTestId('input-edit-comment')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.change(await findByTestId('input-edit-comment'), {
                target: { value: '' }
            });
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.submit(await findByTestId('edit-comment-submit'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-edit-comment').value).toBe('');
                expect(getByText('admin (edited)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkeszti az egyik hozzászólást', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByText, getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Edited comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn(),
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('input-edit-comment')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.change(await findByTestId('input-edit-comment'), {
                target: { value: 'Like' }
            });
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.submit(await findByTestId('edit-comment-submit'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-edit-comment').value).toBe('Like');
                expect(getByText('admin (edited)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkeszti az egyik hozzászólást', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByText, getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Szerkesztett hozzászólás'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn(),
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('input-edit-comment')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.change(await findByTestId('input-edit-comment'), {
                target: { value: 'Like' }
            });
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.submit(await findByTestId('edit-comment-submit'));

            await waitFor(() => {
                expect(getByTestId('input-edit-comment').value).toBe('Like');
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené más hozzászólását', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserComment }));

            const { getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené más hozzászólását, akinek a neve s-re végződik', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminEndsWithSFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentEndsWithS]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentEndsWithS }));

            const { getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené az egyik hozzászólást, de végül visszalép a szerkesztés ellenére is', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithCommentHun }));

            const { findByTestId, getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.click(await findByTestId('edit-comment-return-modal'));

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené más hozzászólását, de végül visszalép a szerkesztés ellenére is', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentHun }));

            const { findByTestId, getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.click(await findByTestId('edit-comment-return-modal'));

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, nincsen bejelentkezett felhasználó', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => []);
            useUser.mockImplementation(() => ({ user: null }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: null
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: null }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`React (JavaScript library) | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, nincsen bejelentkezett felhasználó', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => []);
            useUser.mockImplementation(() => ({ user: null }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithCommentHun }));

            render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: null
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: null }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`HTML5 | ${process.env.REACT_APP_FIREBASE_APP_NAME}`)
            });
        });
    });
})
