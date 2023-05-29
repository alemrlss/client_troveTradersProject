import { useAuthContext } from "../contexts/authContext";

function Home() {
  const { logout } = useAuthContext();
  return (
    <div>
      <h1 className="text-center text-6xl pt-10">HAS ENTRADO A LA APP.</h1>

      <button onClick={() => {logout()}}> Cierra la TODO</button>
    </div>
  );
}

export default Home;
