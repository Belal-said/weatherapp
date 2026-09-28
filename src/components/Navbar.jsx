import logo from "../images/image.png";

export default function Navbar() {
    return (
        <div className="navbar">
            <div className="logo-name-container">
                <img src={logo} className="logo-image" />
                <p className="weather-app">Weather App</p>
            </div>
            <div>
                <select name="Units" id="" className="selector">
                    <option value="" className="selector-modal">Units</option>
                </select>
            </div>
        </div>
    );
}
