import React from "react";

export default function AuthShell({ bg, children }) {
  return (
    <div className="auth-bg" style={{ backgroundImage: `url(${bg})` }}>
      <div className="auth-card text-white">{children}</div>
    </div>
  );
}
