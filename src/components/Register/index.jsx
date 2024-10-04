import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Joi from 'joi';
import './index.css'

export default function Register() {
  const navigate = useNavigate();
  let [validationError, setValidationError]= useState([]);
  let [errorMsg, setErrorMsg]= useState('');

  function validation(){
    const schema = Joi.object({
      userName:Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

      dateOfBirth: Joi.date() 
      .less('1-1-2010')
      .required().messages({ 'date.less':'year must be less than 2010'}),

      email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),

      password : Joi.string().pattern(new RegExp('^[A-Za-z0-9]{5,20}$')).required().messages({'string.pattern.base':'password must be more than 5 characters and less than 20 characters'}),

      rePassword: Joi.string()
      .valid(Joi.ref('password'))
      .required().messages({ 'any.only':'password doesn\'t match', 'string.empty':'confirmation password is required'})
    })
    return schema.validate(userData, {abortEarly:false})         
  }


  let [userData,setUserData] = useState({
    userName:'',
    dateOfBirth:'',
    email:'',
    password:'',
    rePassword:'',
  })


  const getData = (e)=>{
    let data = {...userData};
    data[e.target.name]=e.target.value;
    setUserData(data)
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationError([]);
    const validate = validation();
    if(validate.error){
      setValidationError(validate.error.details);
    }
    else{
      axios.post('http://hawas.runasp.net/api/v1/Register', userData)
      .then((res) => {
        navigate('/login')
      })
      .catch((err) => {
        setErrorMsg(err.response.data);
      });
    }
  };
  return (
    <div className='mb-3'>
      <div className='container w-50'>
        <h1 className='text-center mb-3'>Register</h1>
        {errorMsg.length>0 && (<h1 className='h6 alert alert-danger'>{errorMsg}</h1>)}
        {validationError.length>0 && (validationError.map((error,index)=>(
          <h1 key={index} className='h6 alert alert-danger'>{error.message}</h1>
        )))}
        <form onSubmit={handleSubmit} action="" className='mt-4 mx-lg-5 d-flex flex-column'>
          <label htmlFor="" className='form-label fs-4'>Username</label>
          <input type="text" name='userName' className='form-control rounded-5 mb-4' onChange={getData}/>
          <label htmlFor="" className='form-label fs-4'>Date of birth</label>
          <input type='date' name='dateOfBirth' className='form-control rounded-5 mb-4' onChange={getData}/>
          <label htmlFor="" className='form-label fs-4'>Email</label>
          <input type="email" name='email' className='form-control rounded-5 mb-4' onChange={getData}/>
          <label htmlFor="" className='form-label fs-4'>Password</label>
          <input type="password" name='password' className='form-control rounded-5 mb-4' onChange={getData}/>
          <label htmlFor="" className='form-label fs-4'>Confirm password</label>
          <input type="password" name='rePassword' className='form-control rounded-5 mb-4' onChange={getData}/>
          <button type='submit' className='custom-submit-button fs-5'>Submit</button>
        </form>
      </div>
    </div>
  )
}
