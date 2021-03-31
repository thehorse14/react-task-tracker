import { FaSignOutAlt } from 'react-icons/fa'

const SignOut = ({ auth }) => {
    return auth.currentUser && (
      <>
      <FaSignOutAlt className='btn-icon margin-small'size={32} onClick={() => auth.signOut()}/>
      </>
    )
}

export default SignOut
