import BottomNext from "../../components/BottomNext";
import Logo from "../../components/Logo";
import NavigationDots from "../../components/NavigationDots";
import LogoIcon from "../../components/LogoIcon";
import MenuIcon from "../../components/MenuIcon";
import { Link } from "react-router-dom";

function InstructionFour() {
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
          Let's Get <br />
          Started.
        </h3>
        <p className="text-justify font-roboto text-sm font-light w-86 leading-snug">
          Now that you know our purpose, you're ready to be and find hope. We
          are available to clear all your doubts.
        </p>
      </div>
      <div className="w-86 flex justify-between mx-6 pt-16">
        <NavigationDots currentPage={4} />
         <Link to="/loginorguest">
           <BottomNext/>
         </Link>
      </div>
    </div>
  );
}

export default InstructionFour;
