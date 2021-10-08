import { getAuth, signInWithPopup, GoogleAuthProvider , GithubAuthProvider , createUserWithEmailAndPassword  , signOut } from "firebase/auth";
import initializeAuthn from './Firebase/firebase.Initialize';
import './App.css'
import { useState } from "react";

initializeAuthn();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


function App() {

  const [user,setUser] = useState({});
  const auth = getAuth();

  const googleSignIn = () =>{

    signInWithPopup(auth, googleProvider)
    .then(result =>{
      const user = result.user;
      const {displayName,email,photoURL} = user;
      const newUser = {
        name: displayName,
        email: email,
        image: photoURL
      };
      setUser(newUser);
    })
    .catch(error => {
        const errorMessage = error.message;
        console.log(errorMessage)
    })
  };


  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser({});
    }).catch((error) => {
      console.log(error.message)
    });
  }

  
  
    const gitHubSignIn = () => {
      signInWithPopup(auth, githubProvider)
      .then(result => {
        console.log(result.user)
        const {displayName,email,photoURL} = result.user;
        const newUser = {
          name: displayName,
          email: email,
          image: photoURL
        };
        setUser(newUser);
        console.log('newUser',newUser);
      })
      .catch(error => {
        const errorMessage = error.message;
        console.log(errorMessage)
      })
  
    };
  
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(email,password);
      if(password.length > 6){
        if(/(?=.*[A-Z].*[A-Z])/.test(password)){
          if(/(?=.*[a-z].*[a-z].*[a-z])/.test(password)){
            if(/(?=.*[0-9].*[0-9])/.test(password)){
              if(/(?=.*[!@#$&*])/.test(password)){

              }else{            
                setError('Password Must Includes at least one special case letter.');
                return;
              }
            }else{            
              setError('Password Must Includes at least two digits');
              return;
            }
          }else{            
            setError('Password Must Includes at least three lower-case letter');
            return;
          }
        }else{            
          setError('Password Must Includes at least two upper-case letter');
          return;
        }
      }else{
        setError('Password Must Be 6 Characters Long');
        return;
      }
      createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result.user)
        const {displayName,email,photoURL} = result.user;
        const newUser = {
          name: displayName,
          email: email,
          image: photoURL
        };
        setUser(newUser);
        console.log('newUser',newUser);
      })
      .catch(error => {
        const errorMessage = error.message;
        console.log(errorMessage)
      })
  
    };


    const handleEmail = e => {
        setEmail(e.target.value);
        setError('');
    }

    const handlePassword = e => {
        setPassword(e.target.value);
    }

  
return (
    <div className="">
        {
          !user.name?<div>
          <button onClick={googleSignIn}>Google SignIN</button>
          <button onClick={gitHubSignIn}>GitHub SignIN</button>
        </div>:
        <button onClick={handleSignOut}> Sign Out </button>
        }
        
        {
          user.name && <div>
            <img src={user.image} alt="" />
            <h1>Welcome {user.name}</h1>
            <h3>Email: {user.email}</h3>
          </div>
        }
        <div className="container">
            <form className="w-50" onSubmit={handleSubmit}>

            {/* email  */}
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input onBlur={handleEmail} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>

                {/* password  */}
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input onBlur={handlePassword} type="password" className="form-control" id="exampleInputPassword1"/>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                {/* {
                  error.length ? <div className="text-danger">{error}</div>
                  :
                  <div className="text-danger"></div>
                } */}
                <div className="text-danger">{error}</div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
        <hr />
        <br /><br /><br />
    </div>
  );
}

export default App;
