import MapComponent from '@src/leaflet'
import style from './style.module.css'
import UiLayer from '@src/uiLayer'

const Phone = () => {
  return (
    <div className={style.phone}>
        <UiLayer />
        <MapComponent />
    </div>
  )
}

export default Phone