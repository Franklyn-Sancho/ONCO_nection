import { Link } from "react-router-dom";
import BottomNext from "../../components/BottomNext";
import Logo from "../../components/Logo";
import LogoIcon from "../../components/LogoIcon";
import MenuIcon from "../../components/MenuIcon";
import NavigationDots from "../../components/NavigationDots";
import { ArrowRightIcon } from "@heroicons/react/24/solid";


function LoginOrGuest() {
  return (
    <div className="instruction-two">
      <div className="w-90 flex justify-between mx-4 pt-3">
        <LogoIcon />
        <MenuIcon />
      </div>
      <div className="flex justify-center items-center mt-16 mb-24">
        <Logo />
      </div>
      <div className="h-48 flex flex-col m-6">
        <h3 className="font-roboto font-bold text-5xl mb-3 leading-tight">
          What's Your <br />
          Choice?
        </h3>
        <p className="text-justify font-roboto text-sm font-light w-80 leading-snug">
          You don’t need to log in to view our content. Here you are free to
          participate or be a guest.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center m-2">
        <button className="w-86 h-14 rounded-full border border-white font-roboto font-bold text-xs">
            LOGIN
        </button>
        <button className="w-48 flex justify-evenly items-center font-roboto font-bold text-xs mt-8">
            CONTINUE AS A GUEST
            <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default LoginOrGuest
