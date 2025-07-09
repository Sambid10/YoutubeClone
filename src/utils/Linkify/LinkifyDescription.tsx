import React from "react";
import Linkify from "linkify-react";
export default function LinkifyDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  const options = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-500 hover:text-blue-600  ", // Tailwind styles
  };
  return <Linkify options={options}>{children}</Linkify>;
}
