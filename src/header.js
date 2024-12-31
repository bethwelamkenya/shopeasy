import shop from "./images/shop.svg";
import search from "./images/search.svg";
import cart from "./images/shopping_cart.svg";

const Header = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    return (
        <header className="header">
            <div className="header__container">
                {/* Logo */}
                <div className="header__logo">
                    <a href="/"><img src={shop} alt={"shop"}/> ShopEasy</a>
                </div>

                {/* Search Bar */}
                <div className="header__search">
                    <input type="text" placeholder="Search for products..."/>
                    <button type="button"><img src={search} alt={"search"} className={"search_icon"}/></button>
                </div>

                {/* Navigation Links */}
                <nav className="header__nav">
                    <a href="/categories">Categories</a>
                    <a href="/deals">Deals</a>
                    <a href="/contact">Contact</a>
                </nav>

                {/* User Actions */}
                <div className="header__actions">
                    <a href="/cart" className="header__cart">
                        <img src={cart} alt={"cart"} className={"search_icon"}/>
                    </a>
                    {isLoggedIn ? (
                        <a href="/account">{user.name}</a>
                    ) : (
                        <a href="/login" className="header__login">
                            Login
                        </a>
                        )}
                </div>
            </div>
        </header>
    );
}

export default Header;