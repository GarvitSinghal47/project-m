import React from "react";
import { useHistory } from "react-router";
import { useState } from "react";

const Signup = (props) => {
     let history = useHistory();
    const [credentials, setcredentials] = useState({
         name:"",
       email: "",
         password: "",
       cpassword:""
     });

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handlesubmit = async (e) => {
      e.preventDefault();
     const { name, email, password } = credentials;

      // API Call
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,
          email,
          password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success === true) {
        //save the auth token and redirect
        localStorage.setItem("token", json.authtoken);
          history.push("/");
          props.showAlert("Sign up succesfully","success");
      } else {
        props.showAlert("invalid credential","danger")
      }
    };

  return (
    <div>
      <form onSubmit={handlesubmit}>
        <div className="form-group my-2">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            onChange={onChange}
            type="text"
            className="form-control"
            id="name"
            aria-describedby="nameHelp"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            name="email"
            onChange={onChange}
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            name="password"
            onChange={onChange}
            type="password"
            className="form-control"
            id="Password"
            placeholder="Password"
            minLength={5}
            required
          />
        </div>
        <div className="form-group my-2">
          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input
              name="cpassword"
              onChange={onChange}
              type="password"
              className="form-control"
              id="cpassword"
              placeholder="Confirm Password"
              minLength={5}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
