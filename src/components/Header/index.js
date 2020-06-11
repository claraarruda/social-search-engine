import React from "react";

const Header = () => {
  return (
    <div className="ui secondary pointing menu">
      <div className="logo item">
        <span style={{ fontWeight: 900 }}>SOCIAL</span>
        <span style={{ fontWeight: 100, textDecoration: "underline overline" }}>
          SEARCH
        </span>
        <span style={{ fontWeight: 900 }}>ENGINE</span>
      </div>
      <div className="right menu">
        <button className="ui item button">Entrar</button>
        <button className="ui item button">Cadastre-se</button>
      </div>
    </div>
  );
};

export default Header;
