import { Request, Response } from 'express';
import { controller, get, post } from './decorators';
import { bodyValidator } from './decorators/bodyValidator';

@controller('/auth')
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    res.send(`
    <form method="POST" action="/auth/login">
      <div>
        <label>Email</label>
        <input name="email"></div>
      <div>
        <label>Password</label>
        <input name="password" type="password">
      </div>
      <button>Submit</button>
    </form>
  `);
  }

  @post('/login')
  @bodyValidator('email', 'password')
  postLogin(req: Request, res: Response) {
    const {email, password} = req.body;

    if (email === 'ho@ho.com' && password === '12345') {
      req.session = {loggedIn: true};
      res.redirect('/');
    } else {
      return res.send('Invalid email or password');
    }
  }

  @get('/logout')
  getLogout(req: Request, res: Response) {
    req.session = undefined;
    res.redirect('/');
  }
}

