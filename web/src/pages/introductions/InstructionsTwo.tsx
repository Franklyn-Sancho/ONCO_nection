import { Link } from "react-router-dom";
import BottomNext from "../../components/BottomNext";
import Logo from "../../components/Logo";
import NavigationDots from "../../components/NavigationDots";
import LogoIcon from "../../components/LogoIcon";
import MenuIcon from "../../components/MenuIcon";

function InstructionTwo() {
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
          Tell Your <br />
          Story
        </h3>
        <p className="text-justify font-roboto text-sm font-light w-86 leading-snug">
          Tell your story, testify, share your experience, your struggle and
          your healing; tell us your learnings and vision of life
        </p>
      </div>
      <div className="w-86 flex justify-between mx-6 pt-16">
        <NavigationDots currentPage={2} />
        <Link to="/3">
        <BottomNext />
        </Link>
        
      </div>
    </div>
  );
}

export default InstructionTwo;
