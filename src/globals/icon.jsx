import './icon.css'

export const Icon = (
    {
        src = "",
        size = 35,
        backgroundColor = "var(--icon-tint-color)",
        clickable = false,
        rotatingIcon = false,
        className = '',
        onClick = () => {
        }
    }
) => {
    const styles = {
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        mask: `url(${src}) center/contain no-repeat`,
        WebkitMask: `url(${src}) center/contain no-repeat`,
    }
    return <div style={styles}
                onClick={clickable ? (() => onClick()) : null}
                className={
                    `${clickable ? "clickable_icon" : ""} 
                    ${rotatingIcon ? "rotating-icon" : ""}
                    ${className}`
                }/>
}