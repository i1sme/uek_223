import { AuthService } from "../services/AuthService";
import { Router } from "../router/Router";
import { Navbar } from "../components/Navbar";

/** Renders and handles the login form */
export function renderLoginView(
  container: HTMLElement,
  navbar: Navbar
): void {
  navbar.render();

  container.innerHTML = `
    <div class="form-card">
      <h2>Sign in to MiniTwitter</h2>
      <div id="login-alert"></div>
      <form id="login-form">
        <div class="form-group">
          <label for="login-username">Username</label>
          <input id="login-username" type="text" placeholder="Enter your username" required />
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input id="login-password" type="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%">Sign in</button>
      </form>
      <p style="margin-top:16px;text-align:center;font-size:14px;color:var(--text-muted)">
        Don't have an account? <a href="#/register">Register</a>
      </p>
    </div>
  `;

  const form = container.querySelector<HTMLFormElement>("#login-form")!;
  const alert = container.querySelector<HTMLDivElement>("#login-alert")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = (
      container.querySelector<HTMLInputElement>("#login-username")!
    ).value.trim();
    const password = (
      container.querySelector<HTMLInputElement>("#login-password")!
    ).value;

    const btn = form.querySelector("button")!;
    btn.disabled = true;
    alert.innerHTML = "";

    try {
      await AuthService.login(username, password);
      navbar.render();
      Router.navigate("/feed");
    } catch (err) {
      alert.innerHTML = `<div class="alert alert--error">${(err as Error).message}</div>`;
      btn.disabled = false;
    }
  });
}
