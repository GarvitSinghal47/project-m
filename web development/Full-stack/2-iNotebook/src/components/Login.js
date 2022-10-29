import { useState } from "react";
import React from "react";
import { useHistory } from "react-router";

export const Login = (props) => {
    let history = useHistory();
  const [credentials, setcredentials] = useState({ email: "", password: "" });


  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    // API Call
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
      console.log(json);
      if (json.success === true)
      {
          //save the auth token and redirect
          localStorage.setItem("token", json.authtoken);
          props.showAlert("login succesfully", "success");
          history.push("/");


      }
      else {
          props.showAlert("invalid detail", "danger");
      }
  };

  return (
    <div>
      <form onSubmit={handlesubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            name="email"
            value={credentials.email}
            onChange={onChange}
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            value={credentials.password}
            onChange={onChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
