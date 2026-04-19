import { useEffect, useState } from "react";
import { Button } from "../ui/button";
/* import { ArrowUpIcon } from "lucide-react"; */

// Floating button for quickly returning to the top of long pages
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed items-center bottom-5 right-5 z-40">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="rounded-full shadow-md"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ⭡
        {/* <ArrowUpIcon /> */}
      </Button>
    </div>
  );
}

export default BackToTopButton;