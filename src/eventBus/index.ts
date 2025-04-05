
type EventCallback<T = unknown> = (data: T) => void;

class EventBus {
    private listeners: Record<string, EventCallback[]> = {};

    /**
     * 订阅事件
     * @param event 事件名称
     * @param callback 事件触发时执行的回调
     */
    public on<T = unknown>(event: string, callback: EventCallback<T>): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback as EventCallback);
    }

    /**
     * 发布事件
     * @param event 事件名称
     * @param data 事件携带的数据
     */
    public emit<T = unknown>(event: string, data?: T): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data as T));
        }
    }

    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param callback 要移除的回调函数
     */
    public off<T = unknown>(event: string, callback: EventCallback<T>): void {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                listener => listener !== callback
            );
        }
    }

    /**
     * 清除指定事件的所有监听器
     * @param event 事件名称
     */
    public clear(event: string): void {
        if (this.listeners[event]) {
            delete this.listeners[event];
        }
    }
}

// 创建 EventBus 单例
const eventBus = new EventBus();
export default eventBus;
