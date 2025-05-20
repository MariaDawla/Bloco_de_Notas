export const Tab = ({title, className, onClick}) => {
    return <div className={`tab ${className}`} onClick={onClick}><span>{title}</span></div>
}