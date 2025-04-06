
import style from "./style.module.css"
import Navigation from "./navigation"
import SearchBox from "./searchBox"


export default function() {
    return (
        <div className={style.screen}>
            <div className={style.top}>
                <SearchBox />
            </div>
            <div className={style.bottom}>
                <Navigation />
            </div>
        </div>
    )
}