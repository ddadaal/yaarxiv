import React from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface Props {
  children: string;
}

export const LatexContent: React.FC<Props> = ({ children }) => {
  return <Latex>{children}</Latex>;
};

