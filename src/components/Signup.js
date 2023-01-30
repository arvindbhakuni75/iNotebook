import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

  const [formdata, setFormdata] = useState({name: "", email:"", password:"", cpassword:""});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {name, email, password} = formdata;
    const response = await fetch("http://localhost:5000/api/auth/createuser",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name, email, password}),
      }
    );
    const json = await response.json();
    console.log(json);
    if(json.success){
      navigate("/login");
      props.showAlert("Account created Successfuly!", "success")
    } else {
      props.showAlert("Invalid user input", "danger");
    }
  };

  const onChange = (e) => {
    setFormdata({...formdata, [e.target.name]: e.target.value})
  };

  return (
    <div className='container'>
      <div className="row login">
        <div className="col-md-6">
        <h2>Create your Account on iNotebook !</h2>
       <form onSubmit={handleSubmit}>
        <div className="mb-3 my-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name= "name" onChange={onChange}  />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" minLength={5} required onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" minLength={5} required onChange={onChange} />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">I am not a robot</label>
        </div>
        <button type="submit" className="btn btn-success">Sign Up</button>
      </form>
        </div>
      </div>
      
    </div>
  )
}

export default Signup
