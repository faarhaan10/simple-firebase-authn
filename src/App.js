import { getAuth, signInWithPopup, GoogleAuthProvider , GithubAuthProvider , createUserWithEmailAndPassword , sendPasswordResetEmail , signInWithEmailAndPassword , sendEmailVerification , updateProfile , signOut } from "firebase/auth";
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
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [islogin, setIsLogin] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(email,password);
      if(password.length > 6){
        /* 
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
 */
      }else{
        setError('Password Must Be 6 Characters Long');
        return;
      }
      islogin ? userLoggin(email , password) :newRegister(email, password);
  
    };

    const userLoggin = (email , password) => {
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
    }
    

    const newRegister = (email, password) => {
      createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const {displayName,email,photoURL} = result.user;
        const newUser = {
          name: displayName,
          email: email,
          image: photoURL
        };
        setUser(newUser);
        emailVarification();
        updateUserProfile();
        console.log('newUser',newUser);
      })
      .catch(error => {
        const errorMessage = error.message;
        console.log(errorMessage)
      })
    }

    const emailVarification = () => {
      sendEmailVerification(auth.currentUser)
        .then(result => {
          console.log(result)
        });
    }

    const resetPassword = () => {
      sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result)
      })
      .catch((error) => {
        setError(error.message)
      });
    }

    const updateUserProfile = () => {
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(result => {
console.log(result)
      }).catch((error) => {
        setError(error.message)
      });
    }
    const toggleLogin = e => {
      setIsLogin(e.target.checked);
    }

    

    const handleName = e => {
        setName(e.target.value);
    }


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
          <h1 className="text-primary">Please {islogin ? 'Login' : 'Register'}</h1>
            <form className="w-50" onSubmit={handleSubmit}>

            {/* name  */}
                {!islogin && <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label">Name</label>
                    <input onBlur={handleName} type="text" className="form-control"/>
                </div>}

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
                    <input onChange={toggleLogin} type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Already Registered?</label>
                </div>
                {/* {
                  error.length ? <div className="text-danger">{error}</div>
                  :
                  <div className="text-danger"></div>
                } */}
                <div className="text-danger">{error}</div>
                <button type="submit" className="btn btn-primary">{islogin ? 'Login' : 'Register'}</button>
                <br /> 
            </form>
                <button className="btn btn-danger" onClick={resetPassword}>Forget Password</button>
        </div>
        <hr />
        <br /><br /><br />
    </div>
  );
}

export default App;
