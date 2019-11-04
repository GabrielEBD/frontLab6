import React, {Component} from 'react';
import axios from 'axios';
import './SignIn.css';

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
class SignIn extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    
    async handleSubmit(e){
        e.preventDefault();
        const Body = {
            query:`
            mutation Login ($credentials: LoginInput!){
                login(credentials: $credentials)
            }
            `,
            variables:{
                credentials:{
                    username: document.getElementById("username").value,
                    password: encrypt(document.getElementById("password").value)
                }
            }
        }
        await axios
        .post('http://18.189.231.240/graphiql', Body, {mode:"cors"})
        .then(res => {
            let data = res.data.data.login;
            if(data === '-1'){
                alert('Usuario no autenticado ...')
            }else if(data === 'LDAPException found'){
                alert(data)
            }else{
                sessionStorage.setItem('token', data)
                alert('Usuario autenticado')
            }
        })
        .catch(err => console.log(err))
    }
    render(){
        return(
            <div className='Body'>
                <div className='Box'>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Username
                            <input type='text' id='username'/>
                        </label> <br/>
                        <label>
                            Password
                            <input type='password' id='password'/>
                        </label> <br/>
                        <input type='submit' value='Log In'/>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignIn;
