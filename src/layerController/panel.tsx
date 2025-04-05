import { useEffect ,useState} from 'react';
import eventBus from '@src/eventBus';
import style from "./style.module.css"


export default function Panel() {
    const [text,setText] = useState('加载中');
    useEffect(() => {
        const onButtonClick = (data: any) => {
            console.log('Panel component received data:', data);
            setText("ok");
        };
        eventBus.on('layerController-button-click', onButtonClick);
        return () => {
            eventBus.off('layerController-button-click', onButtonClick); 
        }
    }, []);
    return (
        <div className={style.ui}>{text}</div>
    );
}