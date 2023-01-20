import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "./../axios-client";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationPages, setPaginationPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers();
    }, [pageNumber]);

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get(`/users?page=${pageNumber}`)
            .then(({ data }) => {
                setUsers(data.data);
                setLoading(false);
                setPaginationPages(data.meta);
                setLastPage(data.meta.last_page);
                console.log(data.meta);
                console.log({ pageNumber });
                console.log(lastPage);
            })
            .catch(() => setLoading(false));
    };

    const onDelete = (u) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        } else {
            axiosClient.delete(`/users/${u.id}`).then(() => {
                setNotification("User was succesfully deleted");
                getUsers();
            });
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">
                    Add new user
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => (
                                <tr>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link
                                            to={"/users/" + u.id}
                                            className="btn-edit"
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={() => onDelete(u)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            <tr>
                                <td colSpan={5} className="text-center">
                                    <div className="pagination">
                                        {
                                            <button
                                                className={`page-number`}
                                                onClick={() => setPageNumber(1)}
                                            >
                                                <p>{"<|"}</p>
                                            </button>
                                        }
                                        {pageNumber === 1 ? (
                                            <p>{"< Previous "}</p>
                                        ) : (
                                            <button
                                                className={`page-number`}
                                                onClick={() =>
                                                    setPageNumber(
                                                        pageNumber - 1
                                                    )
                                                }
                                            >
                                                <p>{"< Previous "}</p>
                                            </button>
                                        )}
                                        {/* <PaginatedItems itemsPerPage={4} /> */}
                                        {paginationPages &&
                                            paginationPages !== undefined &&
                                            paginationPages.links.map(
                                                (link) => {
                                                    if (link.url !== null) {
                                                        if (
                                                            link.label ===
                                                                "&laquo; Previous" ||
                                                            link.label ===
                                                                "Next &raquo;"
                                                        ) {
                                                            return null;
                                                        }
                                                        return (
                                                            <button
                                                                className={`page-number ${
                                                                    link.active &&
                                                                    "active"
                                                                } `}
                                                                onClick={() =>
                                                                    setPageNumber(
                                                                        parseInt(
                                                                            link.label,
                                                                            10
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                <p>
                                                                    {" "}
                                                                    {link.label}
                                                                </p>
                                                            </button>
                                                        );
                                                    }
                                                }
                                            )}
                                        {pageNumber === lastPage ? (
                                            <p>{"Next >"}</p>
                                        ) : (
                                            <button
                                                className={`page-number`}
                                                onClick={() =>
                                                    setPageNumber(
                                                        pageNumber + 1
                                                    )
                                                }
                                            >
                                                <p>{"Next >"}</p>
                                            </button>
                                        )}
                                        {
                                            <button
                                                className={`page-number`}
                                                onClick={() =>
                                                    setPageNumber(lastPage)
                                                }
                                            >
                                                <p>{"|>"}</p>
                                            </button>
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
