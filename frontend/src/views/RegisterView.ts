import { AuthService } from "../services/AuthService";
import { Router } from "../router/Router";
import { Navbar } from "../components/Navbar";

/** Renders and handles the registration form */
export function renderRegisterView(
  container: HTMLElement,
  navbar: Navbar
): void {
  navbar.render();

  container.innerHTML = `
    <div class="form-card">
      <h2>Create your account</h2>
      <div id="reg-alert"></div>
      <form id="reg-form">
        <div class="form-group">
          <label for="reg-username">Username</label>
          <input id="reg-username" type="text" placeholder="Choose a username (3-50 chars)" required />
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input id="reg-password" type="password" placeholder="At least 6 characters" required />
        </div>
        <div class="form-group">
          <label for="reg-confirm">Confirm Password</label>
          <input id="reg-confirm" type="password" placeholder="Repeat your password" required />
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%">Create account</button>
      </form>
      <p style="margin-top:16px;text-align:center;font-size:14px;color:var(--text-muted)">
        Already have an account? <a href="#/login">Sign in</a>
      </p>
    </div>
  `;

  const form = container.querySelector<HTMLFormElement>("#reg-form")!;
  const alert = container.querySelector<HTMLDivElement>("#reg-alert")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = (container.querySelector<HTMLInputElement>("#reg-username")!).value.trim();
    const password = (container.querySelector<HTMLInputElement>("#reg-password")!).value;
    const confirm = (container.querySelector<HTMLInputElement>("#reg-confirm")!).value;

    if (password !== confirm) {
      alert.innerHTML = `<div class="alert alert--error">Passwords do not match</div>`;
      return;
    }

    const btn = form.querySelector("button")!;
    btn.disabled = true;
    alert.innerHTML = "";

    try {
      await AuthService.register(username, password);
      navbar.render();
      Router.navigate("/feed");
    } catch (err) {
      alert.innerHTML = `<div class="alert alert--error">${(err as Error).message}</div>`;
      btn.disabled = false;
    }
  });
}
