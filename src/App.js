import React, { useState } from "react";
import {
  useRegister,
  useLogin,
  useUsers,
  useUpdateUser,
  useDeleteUser,
} from "./useAuth";

import swal from "sweetalert";

const App = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [newName, setNewName] = useState("");

  const { mutate: register } = useRegister();

  const { mutate: login } = useLogin();
  const { data: users, isLoading, isError } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser();

  const handleRegister = () => {
    register({ name, password });
  };

  const handleLogin = () => {
    login(
      { name, password },
      {
        onSuccess: (data) => setToken(data.token),
      }
    );
  };

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  const handleUpdate = () => {
    if (editUserId && newName) {
      updateUser({ userId: editUserId, newName });
      setEditUserId(null); // Close the edit mode
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button onClick={handleRegister}>Register</button>

      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>

      <div>
        <h3>Welcome, {name}</h3>
        <h2>Users List</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading users</div>
        ) : users && users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {editUserId === user._id ? (
                  <>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="New Name"
                    />
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditUserId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {user.name} &nbsp;{user._id}
                    <button onClick={() => setEditUserId(user._id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
