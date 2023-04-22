import {Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import styled from "@emotion/styled";

const ErrorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

export default function ErrorPage() {
    const error = useRouteError();
    if (process.env.NODE_ENV !== "production") console.error(error);

    return (
        <ErrorWrapper>
            <h1>Something went wrong</h1>
            <p>
                {isRouteErrorResponse(error) ? error.data.message :
                      error instanceof Error ? error.message : "Unknown error"}
            </p>
            <Link to="/">Go back home</Link>
        </ErrorWrapper>
    );
}