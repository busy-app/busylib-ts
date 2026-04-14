declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
declare module '*?sharedworker&inline' {
  const sharedWorkerConstructor: {
    new (options?: { name?: string }): SharedWorker;
  };
  export default sharedWorkerConstructor;
}
