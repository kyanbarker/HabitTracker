import { Box } from "@mui/material";
import { ReactNode, useEffect, useRef } from "react";

interface ClickControllerProps {
  onOutsideClick?: () => void;
  onInsideClick?: () => void;
  children: ReactNode;
}

const ClickController: React.FC<ClickControllerProps> = ({
  onOutsideClick,
  onInsideClick,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // If a click occurs before this click controller has mounted, ignore the event
      if (!containerRef.current) return;

      if (containerRef.current.contains(event.target as Node)) {
        onInsideClick?.();
      } else {
        onOutsideClick?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onOutsideClick, onInsideClick]);

  return (
    <Box ref={containerRef} sx={{ width: "min-content" }}>
      {children}
    </Box>
  );
};

export default ClickController;
