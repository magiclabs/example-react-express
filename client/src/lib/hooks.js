import { useEffect } from 'react';
import useSWR from 'swr';
import { useHistory } from 'react-router-dom';

const fetchUser = (url) =>
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const history = useHistory();
  const { data, error } = useSWR(`${process.env.REACT_APP_SERVER_URL}/api/user`, fetchUser);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      history.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);
  return error ? null : user;
}