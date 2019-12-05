import React, { Component } from "react";
import {Form,FormControl,InputGroup,Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { auth } from "../firebase";

import { Link } from "react-router-dom";
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };
  async onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      await auth.doSignInWithEmailAndPassword(email, password);
      this.setState({ ...INITIAL_STATE });
      this.props.history.push("/dashboard");
    } catch (e) {
      console.log(e.code);
      switch (e.code) {
        case "auth/user-not-found":
          this.setState({ error: "No Account With That Email Address Found!" });
          break;
        case "auth/wrong-password":
          this.setState({ error: "Password Incorrect!" });
          break;
        case "auth/invalid-email":
          this.setState({ error: "Invalid Email Address!" });
          break;
        default:
          console.log(`Something else went wrong: ${e.code}`);
          this.setState({ error: "Unkown Error!" });
          break;
      }
    }
  }
  async socialSignOn(provider) {
    try {
      await auth.doSocialSignIn(provider);
      this.setState({ ...INITIAL_STATE });
      this.props.history.push("./home");
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "" || password.length < 6;

    return (
      <div>
        {error && <p className="error">{error}</p>}
        <Form onSubmit={this.onSubmit.bind(this)}>
          <Form.Label htmlFor="email">Email Address:</Form.Label>
            <InputGroup className="mb-3">
            <FormControl
              placeholder="email"
              autoComplete="email"
              type="email"
              name="email"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={this.handleChange}
              value={this.state.email}
            />
            </InputGroup>
          <Form.Label htmlFor="password">Password</Form.Label>
              <InputGroup className="mb-3">
              <FormControl
                placeholder="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
              />
              </InputGroup>
          <InputGroup className="mb-3">
              <Button type="submit" variant="outline-secondary" disabled={isInvalid}>Login</Button>
          </InputGroup>
          Not Registered yet? <Link to="/signup"> Click here to Register</Link>
        </Form>
        <br />

        <img
          onClick={() => this.socialSignOn("google")}
          alt="google signin"
          src="../img/btn_google_signin.png"
        />
      </div>
    );
  }
}

export default SignIn;
