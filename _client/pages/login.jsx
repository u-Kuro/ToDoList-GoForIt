import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import $ from "jquery";
import { useState } from "react";

export default function Login({ data }) {
  const Nulled=(v)=>{return typeof v === "undefined" ? true : v === null ? true : v.length === 0}
  const El=(id)=>{return document.getElementById(id)}

  const [running, setRunning] = useState(false);

  // On Window Load
  if (typeof window !== "undefined") {
    $(window).on("load", () => {
      Nulled(data.haveAlert)? null :
        !data.haveAlert?  null :
        alert(data.message)
    });
  }

  let login = (e) => {
    e.preventDefault();
    if (!running) {
      setRunning(true);
      // Check Inputs
      if (Nulled(El("useremail").value)) {
        El("useremail").setCustomValidity("");
        return El("#useremail").reportValidity();
      }
      if (Nulled("password").value) {
        El("password").setCustomValidity("");
        return El("password").reportValidity();
      }
      // Loading
      $("#login").children("p").fadeTo(300, 0, () => {
        $("#login").children("p").hide();
        $("#login").children("img").show().fadeTo(300, 1, () => {
        // Send Request
          $.ajax({
            type: "POST",
            url: "/auth/login",
            data: {
              useremail: El("#useremail").value,
              password: El("#password").value,
            },
            success: (data) => {
              $("#login").children("img").fadeTo(300, 0, () => {
                $("#login").children("img").hide();
                $("#login").children("p").show().fadeTo(300, 1, () => {
                  if (data.valid) {
                    Router.push("/home", undefined, { shallow: true });
                  } else {
                    if (data.message === "Password is Incorrect") {
                      El("#password").value = "";
                      El("#password").setCustomValidity(data.message);
                      El("#password").reportValidity();
                    } else if (data.message === "Account is Not Registered") {
                      El("#useremail").value = "";
                      El("#password").value = "";
                      El("#useremail").setCustomValidity(data.message);
                      El("#useremail").reportValidity();
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
    <>
      <Head>
        <title>Signin | GoForIt</title>
      </Head>
      <div className="reg-log-bg">
        <section className="log">
          <div className="log-container">
            <div className="login-form">
              <h1 className="cur-def">Login</h1>
              <input defaultValue={Nulled(data.username) ? "" : data.username} onKeyPress={(e) => {e.key === "Enter" && login(e)}} id="useremail" placeholder="Username or Email" maxLength="255" type="text" required />
              <input onKeyPress={(e) => {e.key === "Enter" && login(e)}} id="password" placeholder="Password" maxLength="255" required type="password" />
              <button onClick={(e) => login(e)} id="login" className="cur-point" >
                <p>Login</p>
                <img className="none" style={{ opacity: "0", width: "0.9em", height: "0.9em" }} src="/icons/loading.svg"/>
              </button>
              <Link href="register">
                <h5 className="cur-point">Don't have an account?</h5>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

Login.getInitialProps = ({ query }) => {
  var data = query;
  return { data };
};
