import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { createContact, getContacts } from '../contacts'
import { useEffect, useRef } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`)
}
// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')
    const contacts = await getContacts(q)
    return { contacts, q };
}
export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    const ref = useRef();
    const submit = useSubmit();

    const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

    useEffect(() => {
        ref.current.value = q;
    }, [q])

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            ref={ref}
                            id="q"
                            className={searching ? 'loading' : ''}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                id="detail"
                className={
                    navigation.state === 'loading' ? 'loading' : ''
                }
            >
                <Outlet />
            </div>
        </>
    );
}
