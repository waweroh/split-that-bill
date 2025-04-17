export const api = {
  bills: {
    getBills: "bills:getBills",
    getBill: "bills:getBill",
    createBill: "bills:createBill",
    updateSelection: "bills:updateSelection",
    getUserSelections: "bills:getUserSelections",
    updatePayment: "bills:updatePayment",
    getPayment: "bills:getPayment",
  },
  users: {
    getOrCreateUser: "users:getOrCreateUser",
    getUserBySessionId: "users:getUserBySessionId",
  },
} as const
