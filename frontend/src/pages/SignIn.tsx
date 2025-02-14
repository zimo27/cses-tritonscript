import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../utils/userSlice";
import { useDispatch, useSelector } from "react-redux";
//import settings from "../utils/config";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state: any) => state.user);
  const { currentUser } = useSelector((state: any) => state.user);

  function handleChange(e: { target: { id: any; value: any } }) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const email = e.target[1].value;
      const password = e.target[2].value;
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        dispatch(signInSuccess(user));
        // ...
        navigate("/");
      });
      // .catch((error) => {
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      // });
      
    } catch (error) {
      dispatch(signInFailure(error));
    }
  }

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" id="email" onChange={handleChange} />
        <input type="password" placeholder="Password" id="password" onChange={handleChange} />
        <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
      </form>
      <div>
        <p>Dont Have an account?</p>
        <Link to="/signup">
          <span>Sign up</span>
        </Link>
      </div>
      <p>{error ? error.message || "Something went wrong!" : ""}</p>
    </div>
  );
}
