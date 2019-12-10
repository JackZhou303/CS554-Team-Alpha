import React, { Component } from "react";
import { auth } from "../firebase";
import {Form,InputGroup,FormControl,Container,Jumbotron,Alert, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Route,Link} from "react-router-dom";
const INITIAL_STATE = {
  displayName: "",
  email: "",
  username:"",
  password: "",
  passwordTwo: "",
  error: null
};
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  handleChange = e => {
    if (e.target.name === "passwordTwo") {
      if (e.target.value !== document.getElementsByName("password").value) {
        this.setState({ error: "Passwords not the same" });
      } else {
        this.setState({ error: null });
      }
    }
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };
  async onSubmit(e) {
    e.preventDefault();
    const { displayName, email, password,username } = this.state;

    try {
      await auth.doCreateUserWithEmailAndPassword(
        email,
        password,
        displayName,
        username
      );
      this.setState({ ...INITIAL_STATE });
      this.props.history.push("/dashboard");
    } catch (e) {
      console.log(e.code);
      switch (e.code) {
        case "auth/invalid-email":
          this.setState({ error: "Invalid Email Address!" });
          break;
        case "auth/weak-password":
          this.setState({
            error: "Password Blank or Password Less Than 6 Characters!"
          });
          break;
        case "auth/email-already-in-use":
          this.setState({ error: "Email Address Already in Use!" });
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
      this.props.history.push("/home");
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { displayName, email, password, passwordTwo, error } = this.state;

    const isInvalid =
      password !== passwordTwo ||
      password === "" ||
      email === "" ||
      displayName === "" ||
      password.length < 6;

    return (
      <div>
        {error && <Alert variant="danger" className="error">{error}</Alert>}
        <Container>
        <Jumbotron>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <Form.Label htmlFor="displayName">Name:</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Display Name"
              autoComplete="text"
              type="text"
              name="displayName"
              onChange={this.handleChange}
              value={this.state.displayName}
            />
            </InputGroup>
          <Form.Label htmlFor="email">Email Address:</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="email"
              autoComplete="email"
              type="email"
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
            </InputGroup>
            <Form.Label htmlFor="username">Username:</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="username"
              autoComplete="username"
              type="username"
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            </InputGroup>
          <Form.Label htmlFor="password">Password:</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="password"
              autoComplete="password"
              type="password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            </InputGroup>
            <Form.Label htmlFor="passwordTwo">Confirm Password</Form.Label>
            <InputGroup className="mb-3">
            <FormControl
              placeholder="confirm password"
              type="password"
              name="passwordTwo"
              onChange={this.handleChange}
              value={this.state.passwordTwo}
            />
            </InputGroup>
          <div className="form-group">
            <Button type="submit" variant="primary" disabled={isInvalid}>
              Submit
            </Button>
          </div>
          <div className="form-group">
            <Link to="/signin">
            <Button type="button" variant="primary">
              SignIn
            </Button>
            </Link>
          </div>
        </Form>

        <img
          onClick={() => this.socialSignOn("google")}
          alt="google signin"
          src="img/btn_google_signin.png"
        />
        </Jumbotron>
        </Container>
      </div>
    );
  }
}

export default SignUp;
