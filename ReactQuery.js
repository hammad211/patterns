import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const queryClient = useQueryClient();

  // GET Request
  const {
    data: getData,
    isLoading: isGetLoading,
    error: getError,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) =>
        res.json()
      ),
  });

  // POST Request
  const postMutation = useMutation({
    mutationFn: (newData) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }).then((res) => res.json()),
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries(["repoData"]);
    },
  });

  // PUT Request
  const putMutation = useMutation({
    mutationFn: (updatedData) =>
      fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["repoData"]);
    },
  });

  // DELETE Request
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["repoData"]);
    },
  });

  if (isGetLoading) return "Loading...";
  if (getError) return "An error has occurred: " + getError.message;

  return (
    <div>
      <h1>{getData.name}</h1>
      <p>{getData.description}</p>
      <strong>Subscribers: {getData.subscribers_count}</strong>{" "}
      <strong>Stars: {getData.stargazers_count}</strong>{" "}
      <strong>Forks: {getData.forks_count}</strong>
      <button
        onClick={() =>
          postMutation.mutate({
            title: "New Post",
            body: "This is the body of the new post",
            userId: 1,
          })
        }
      >
        Create Post
      </button>
      <button
        onClick={() =>
          putMutation.mutate({
            id: 1,
            title: "Updated Post",
            body: "This is the updated body",
            userId: 1,
          })
        }
      >
        Update Post
      </button>
      <button onClick={() => deleteMutation.mutate(1)}>Delete Post</button>
    </div>
  );
}
