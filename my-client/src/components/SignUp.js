import React, { Component } from "react";
import { auth } from "../firebase";
import {Form,InputGroup,FormControl,Container,Jumbotron, Button} from 'react-bootstrap';
import { remoteConfig } from "firebase";
const INITIAL_STATE = {
  displayName: "",
  email: "",
  passwordOne: "",
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
      if (e.target.value !== document.getElementById("passwordOne").value) {
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
    const { displayName, email, passwordOne } = this.state;

    try {
      await auth.doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
        displayName
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
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      console.log(error);
    }
  }

  render() {
    const { displayName, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      displayName === "" ||
      passwordOne.length < 6;

    return (
      <div>
        {error && <p className="error">{error}</p>}
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
              autoComplete="new-password"
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
        </Form>

        <img
          onClick={() => this.socialSignOn("google")}
          alt="google signin"
          src="../img/btn_google_signin.png"
        />
        </Jumbotron>
        </Container>
      </div>
    );
  }
}

export default SignUp;
