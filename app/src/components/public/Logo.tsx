import { useNavigate } from "react-router-dom";

function Logo() {
  const navigator = useNavigate();
  return (
    <button className="!p-0" onClick={() => navigator("/")}>
      <img className="w-24" src="/assets/logo_b.png" />
    </button>
  );
}

export default Logo;
