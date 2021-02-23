import React from 'react';
import useFormValidation from './useFormValidation';
import validateLogin from './validateLogin';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
};

function Login(props) {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    isSubmitting,
    values,
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const [login, setLogin] = React.useState(true);
  const [firebaseError, setFirebaseError] = React.useState(null);

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      props.history.push('/');
    } catch (error) {
      console.error('Auth error', error);
      setFirebaseError(error.message);
    }
  }

  return (
    <div>
      <h2 className='mv3'>{login ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} className='flex flex-column'>
        {!login && (
          <input
            value={values.name}
            name='name'
            onChange={handleChange}
            type='text'
            placeholder='Your name'
            autoComplete='off'
          />
        )}
        <input
          className={errors.email && 'error-input'}
          onBlur={handleBlur}
          value={values.email}
          name='email'
          onChange={handleChange}
          type='email'
          placeholder='Your email'
          autoComplete='off'
        />
        {errors.email && <p className='error-text'>{errors.email}</p>}
        <input
          className={errors.password && 'error-input'}
          onBlur={handleBlur}
          value={values.password}
          name='password'
          onChange={handleChange}
          type='password'
          placeholder='Choose a secure password'
          autoComplete='off'
        />
        {errors.password && <p className='error-text'>{errors.password}</p>}
        {firebaseError && <p className='error-text'>{firebaseError}</p>}
        <div className='flex mt3'>
          <button
            type='submit'
            className='button pointer mr2'
            disabled={isSubmitting}
            style={{ background: isSubmitting ? 'grey' : 'orange' }}
          >
            Submit
          </button>
          <button
            type='button'
            className='button pointer '
            onClick={() => setLogin((prevLogin) => !prevLogin)}
          >
            {login ? 'need to create an account?' : 'already have an account'}
          </button>
        </div>
      </form>
      <div className='forgot-password'>
        <Link to="/forgot">Forgot password ?</Link>
      </div>
    </div>
  );
}

export default Login;
