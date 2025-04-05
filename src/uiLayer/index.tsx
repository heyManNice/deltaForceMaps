
import style from "./style.module.css"
import Navigation from "./navigation"


export default function() {
    return (
        <div className={style.top}>
            <div className={style.bottom}>
                <Navigation />
            </div>
        </div>
    )
}