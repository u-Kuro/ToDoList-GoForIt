import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import $ from "jquery";
import { useState } from "react";

export default function Register() {
  const [running, setRunning] = useState(false);
  const Nulled=(v)=>{return typeof v === "undefined" ? true : v === null ? true : v.length === 0}
  const El=(id)=>{return document.getElementById(id)}

  let registered = (e) => {
    e.preventDefault();
    if (!running) {
      // Check Inputs
      if (Nulled(El("username").value)) {
        El("username").setCustomValidity("");
        return El("username").reportValidity();
      }
      if (Nulled(El("email").value)) {
        El("email").setCustomValidity("");
        return El("email").reportValidity();
      }
      if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(El("email").value)) {
        El("email").setCustomValidity("Please include an '@' in an email address.");
        return El("email").reportValidity();
      }
      if (Nulled(El("password").value)) {
        El("password").setCustomValidity("");
        return El("password").reportValidity();
      }
      if(Nulled(El("cpassword").value)) {
        El("cpassword").setCustomValidity("");
        return El("cpassword").reportValidity();
      }
      if(El("cpassword").value!==El("password").value) {
        El("cpassword").value = "";
        El("cpassword").setCustomValidity("Passwords do not Match");
        return El("cpassword").reportValidity();
      }
      // Load Request
      $("#register").children("p").fadeTo(300, 0, () => {
          $("#register").children("p").hide();
          $("#register").children("img").show().fadeTo(300, 1, () => {
            // Send Request
            $.ajax({
              type: "POST",
              url: "/auth/register",
              data: {
                username: El("username").value,
                email: El("email").value,
                password: El("password").value,
                cpassword: El("cpassword").value,
              },
              success: (data) => {
                $("#register").children("img").fadeTo(300, 0, () => {
                  $("#register").children("img").hide();
                  $("#register").children("p").show().fadeTo(300, 1, () => {
                      if (data.message==="Please include an '@' in an email address.") {
                        El("email").setCustomValidity(data.message);
                        El("email").reportValidity();
                      } 
                      else if (data.message==="Username is already in use") {
                        El("username").value="";
                        El("username").setCustomValidity(data.message);
                        El("username").reportValidity();
                      } 
                      else if (data.message==="Email is already in use") {
                        El("email").value="";
                        El("email").setCustomValidity(data.message);
                        El("email").reportValidity();
                      } 
                      else if (data.message==="Username and Email is already in use") {
                        El("username").value;
                        El("email").value;
                        El("username").setCustomValidity(data.message);
                        El("username").reportValidity();
                      } 
                      else if (data.message==="Passwords do not Match") {
                        El("cpassword").value="";
                        El("cpassword").setCustomValidity(data.message);
                        El("cpassword").reportValidity();
                      } 
                      else if (data.message==="Account is Registered, you may Sign-in") {
                        if (window.confirm(data.message)) {
                          Router.push({
                              pathname: "/login",
                              query: { username: data.username },
                            },
                            "/login",
                            { shallow: true }
                          );
                        }
                      }
                    });
              });
              setRunning(false);
            },
          });
        });
      });
    }
  };

  return (
    <div>
      <Head>
        <title>Signup | GoForIt</title>
      </Head>
      <div className="reg-log-bg">
        <section className="reg">
          <div className="reg-container">
            <form className="register-form">
              <h1 className="cur-def">Register</h1>
              <input
                type="text"
                onKeyPress={(e) => {
                  e.key === "Enter" && registered(e);
                }}
                id="username"
                placeholder="Username"
                maxLength="255"
                required
              />
              <input
                type="email"
                onKeyPress={(e) => {
                  e.key === "Enter" && registered(e);
                }}
                id="email"
                placeholder="Email"
                maxLength="255"
                required
              />
              <input
                type="password"
                onKeyPress={(e) => {
                  e.key === "Enter" && registered(e);
                }}
                id="password"
                placeholder="Password"
                maxLength="255"
                required
              />
              <input
                type="password"
                onKeyPress={(e) => {
                  e.key === "Enter" && registered(e);
                }}
                id="cpassword"
                placeholder="Confirm Password"
                maxLength="255"
                required
              />
              <button
                id="register"
                className="cur-point"
                onClick={(e) => registered(e)}
              >
                <p>Register</p>
                <img
                  className="none"
                  style={{ opacity: "0", width: "0.9em", height: "0.9em" }}
                  src="/icons/loading.svg"
                />
              </button>
              <Link href="login">
                <h5 className="cur-point">Already Have an Account?</h5>
              </Link>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
