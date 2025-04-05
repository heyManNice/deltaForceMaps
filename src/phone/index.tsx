import MapComponent from '../leaflet'
import style from './style.module.css'

const Phone = () => {
  return (
    <div className={style.phone}>
        <MapComponent />
    </div>
  )
}

export default Phone