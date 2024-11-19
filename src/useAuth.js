import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import swal from "sweetalert2";

import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5000" });

// Register Hook
export const useRegister = () => {
  const queryClient = useQueryClient();

  let obj = {
    mutationFn: (userData) => api.post("/query/signup", userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      swal.fire({
        title: "Success!",
        text: "Users fetched successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      console.error("Registration error:", error);
      swal.fire({
        title: "Error!",
        text: `Error fetching users: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  };

  return useMutation(obj);
};

// Login Hook
export const useLogin = () => {
  return useMutation({
    mutationFn: (loginData) => api.post("/query/login", loginData),
    onSuccess: (data) => {
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

// User Hook

export const useUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/query/users");
      return response.data;
    },
  });

  // Debugging state
  console.log("isLoading:", query.isLoading);
  console.log("isError:", query.isError);
  console.log("data:", query.data);

  return query;
};

export const useUsersa = () => {
  const queryFn = async () => {
    const response = await api.get("/query/users");
    return response.data;
  };

  return useQuery({
    queryKey: ["users"],
    queryFn,
    onSuccess: (data) => {
      console.log("Fetched users:", data);
    },
    onError: (error) => {
      console.error("Error fetching users:", error);
    },
  });
};

// Update User Hook
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, newName }) =>
      api.put(`/query/update/${userId}`, { name: newName }), // Send newName as part of request body
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Invalidate users query to refetch data
    },
    onError: (error) => {
      console.error("Update user error:", error);
    },
  });
};

// Delete User Hook
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => api.delete(`/query/user/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      console.error("Delete user error:", error);
    },
  });
};
