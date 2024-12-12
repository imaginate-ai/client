import { useAuth } from "../../providers/AuthProvider";
import SignOutButton from "./SignOutButton";
import LoginButton from "./LoginButton";

const AuthButton = () => {
  const auth = useAuth();
  return auth?.user ? <SignOutButton /> : <LoginButton />;
};

export default AuthButton;
