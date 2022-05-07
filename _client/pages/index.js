import Router from "next/router"
export default function Index() {
  if(typeof window!=="undefined") {
    Router.push({pathname: "/login"});
  }
}