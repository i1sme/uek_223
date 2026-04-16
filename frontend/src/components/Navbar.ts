import { AuthService } from "../services/AuthService";
import { Router } from "../router/Router";

/** Renders the top navigation bar and handles logout */
export class Navbar {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    const user = AuthService.getCurrentUser();
    const isLoggedIn = AuthService.isLoggedIn();

    this.container.innerHTML = `
      <nav class="navbar">
        <span class="navbar__brand">MiniTwitter</span>
        <div class="navbar__links">
          ${
            isLoggedIn
              ? `
            <span class="navbar__user">@${user?.username}</span>
            <a href="#/feed">Feed</a>
            <a href="#/profile">Profile</a>
            ${user?.role === "admin" ? '<a href="#/admin">Admin</a>' : ""}
            <button class="btn btn--outline btn--small" id="navbar-logout">Logout</button>
          `
              : `
            <a href="#/login">Login</a>
            <a href="#/register">Register</a>
          `
          }
        </div>
      </nav>
    `;

    const logoutBtn = this.container.querySelector("#navbar-logout");
    logoutBtn?.addEventListener("click", () => {
      AuthService.logout();
      Router.navigate("/login");
    });
  }
}
