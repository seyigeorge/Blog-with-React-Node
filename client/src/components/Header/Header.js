import React, { Component } from "react";
import image from "./image/image.png";

class Header extends Component {
    render() {
        return (
            <div className="header">
                <img src={image} style={{width:"1355px"}} alt="" />
            </div>
        )
    }
}

export default Header;