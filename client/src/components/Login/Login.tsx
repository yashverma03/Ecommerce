import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import styles from './Login.module.css';
import { loginUser } from '../../utils/api';

const Login = () => {
  const navigate = useNavigate();

  const initialFormData = {
    email: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const { mutate, data, isPending, isSuccess, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (mutationData) => {
      if (mutationData !== undefined) {
        localStorage.setItem('token', mutationData.token as string);
        setFormData(initialFormData);
        navigate('/');
      }
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const getInputs = () => {
    const inputs = [
      {
        id: 'email',
        label: 'Email',
        placeholder: 'Your email',
        type: 'email'
      },
      {
        id: 'password',
        label: 'Password',
        placeholder: 'Your password',
        type: 'password'
      }
    ];

    return inputs.map((input) => {
      return (
        <div className={styles.inputWrap} key={input.id}>
          <h3 className={styles.label}>{input.label}</h3>
          <input
            className={styles.input}
            id={input.id}
            placeholder={input.placeholder}
            type={input.type ?? 'text'}
            value={formData[input.id as keyof typeof formData]}
            onChange={handleInputChange}
            required
          />
        </div>
      );
    });
  };

  const buttonText = isPending ? 'Logging you in...' : 'Login';

  const getError = () => {
    return (
      ((isSuccess && data === undefined) || isError) && (
        <p className={styles.error}>Error in logging</p>
      )
    );
  };

  return (
    <main className={styles.background}>
      <div className={styles.container}>
        <h1 className={styles.title}>Login your account</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {getInputs()}
          <button className={styles.button}>{buttonText}</button>
          {getError()}
        </form>

        <h2 className={styles.subtitle}>
          Don't have an account?{' '}
          <Link className={styles.link} to='/sign-up'>
            Sign Up
          </Link>
        </h2>
      </div>
    </main>
  );
};

export default Login;