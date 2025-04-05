
export type PlaceLevel =
    | "official" //官方名称
    | "unofficialL1" //一级非官方名称粗略
    | "unofficialL2" //二级非官方名称精细
    | "supply" //物资点
    | "highValue" //高价值物资点
    | "action" //可以做某些操作的点,比如红狼手炮点，狙击得吃点
    | "task" //任务点
    | "switch" //拉闸点
    | "accessControl" //刷卡点
    | "eespawn"//重生点
;


//[最小可见缩放级别, 最大可见缩放级别]
export type VisibleZoomRange = [number, number];

/**
 * 不同级别缩放范围
 */
export const ZoomRange:Record<PlaceLevel,VisibleZoomRange> ={
    "official": [18, 20],
    "unofficialL1": [17, 21],
    "unofficialL2": [17, 21],
    "supply": [17, 21],
    "highValue": [17, 21],
    "action": [17, 21],
    "task": [17, 21],
    "switch": [17, 21],
    "accessControl": [17, 21],
    "eespawn": [17, 21]
}


export interface PlaceConfig {
    map: L.Map;
    name: string;
    level: PlaceLevel;
    location: L.LatLngExpression;
}
