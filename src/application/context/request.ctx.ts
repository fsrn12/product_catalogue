import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestContextData {
  readonly correlationId: string;
  readonly tenantId?: string;
  readonly userId?: string;
}

const storage = new AsyncLocalStorage<RequestContextData>();

export const requestContext = {
  run<T>(data: RequestContextData, fn: () => T): T {
    return storage.run(data, fn);
  },

  get(): RequestContextData | undefined {
    return storage.getStore();
  },

  // setTenantId(tenantId: string): void {
  //   const store = storage.getStore();
  //   if (store) {
  //     store.tenantId = tenantId;
  //   }
  // },

  // setUserId(userId: string): void {
  //   const store = storage.getStore();
  //   if (store) {
  //     store.userId = userId;
  //   }
  // },

  update(data: Partial<RequestContextData>): void {
    const current = storage.getStore();
    if (current) {
      storage.enterWith({ ...current, ...data });
    }
  },
};
