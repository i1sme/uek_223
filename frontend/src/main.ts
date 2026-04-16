import "./styles.css";
import { Router } from "./router/Router";
import { AuthService } from "./services/AuthService";
import { Navbar } from "./components/Navbar";
import { renderLoginView } from "./views/LoginView";
import { renderRegisterView } from "./views/RegisterView";
import { renderFeedView } from "./views/FeedView";
import { renderPostDetailView } from "./views/PostDetailView";
import { renderProfileView } from "./views/ProfileView";
import { renderAdminView } from "./views/AdminView";

const navbarContainer = document.getElementById("navbar")!;
const mainContent = document.getElementById("main-content")!;
const navbar = new Navbar(navbarContainer);

/** Redirects to login if user is not authenticated */
function requireAuth(): boolean {
  if (!AuthService.isLoggedIn()) {
    Router.navigate("/login");
    return false;
  }
  return true;
}

const router = new Router();

router
  .on("/login", () => {
    if (AuthService.isLoggedIn()) {
      Router.navigate("/feed");
      return;
    }
    renderLoginView(mainContent, navbar);
  })
  .on("/register", () => {
    if (AuthService.isLoggedIn()) {
      Router.navigate("/feed");
      return;
    }
    renderRegisterView(mainContent, navbar);
  })
  .on("/feed", () => {
    if (!requireAuth()) return;
    renderFeedView(mainContent, navbar);
  })
  .on("/posts/:id", ({ id }) => {
    if (!requireAuth()) return;
    renderPostDetailView(mainContent, navbar, id);
  })
  .on("/profile", () => {
    if (!requireAuth()) return;
    renderProfileView(mainContent, navbar);
  })
  .on("/admin", () => {
    if (!requireAuth()) return;
    const user = AuthService.getCurrentUser();
    if (user?.role !== "admin") {
      Router.navigate("/feed");
      return;
    }
    renderAdminView(mainContent, navbar);
  });

router.start();
