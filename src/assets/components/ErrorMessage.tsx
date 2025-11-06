import React from "react";

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <div style={{ padding: "1rem", backgroundColor: "#fee", border: "1px solid #f99", borderRadius: "8px" }}>
      <p style={{ color: "#900" }}>Error: {message}</p>
    </div>
  );
}
