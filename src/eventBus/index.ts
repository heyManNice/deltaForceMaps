type EventCallback<T = unknown> = (data: T) => void;

class EventBus {
  /**
   * 订阅事件
   * @param event 事件名称
   * @param callback 回调函数
   */
  public on<T = unknown>(event: string, callback: EventCallback<T>): void {
    const wrappedCallback = (e: CustomEvent<T>) => callback(e.detail);
    window.addEventListener(event, wrappedCallback as EventListener);
  }

  /**
   * 发布事件
   * @param event 事件名称
   * @param data 事件数据
   */
  public emit<T = unknown>(event: string, data?: T): void {
    const customEvent = new CustomEvent<T>(event, { detail: data });
    window.dispatchEvent(customEvent);
  }

  /**
   * 移除指定事件监听器
   * @param event 事件名称
   * @param callback 要移除的回调函数
   */
  public off<T = unknown>(event: string, callback: EventCallback<T>): void {
    const wrappedCallback = (e: CustomEvent<T>) => callback(e.detail);
    window.removeEventListener(event, wrappedCallback as EventListener);
  }
}

// 导出单例
const eventBus = new EventBus();
export default eventBus;
