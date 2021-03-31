import Firebase from './Firebase'

const SignIn = ({ auth }) => {
    const signInWithGoogle = () => {
      const provider = new Firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
  
    return (
      <button className='btn btn-primary' onClick={signInWithGoogle}>Sign In With Google</button>
    )
}

export default SignIn