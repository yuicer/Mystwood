import wxCloudAdapter from '@/common/services/adapters/wxCloudAdapter'

const adapter = wxCloudAdapter

export const getState = (...args) => adapter.getState(...args)
export const createSpace = (...args) => adapter.createSpace(...args)
export const acceptInvite = (...args) => adapter.acceptInvite(...args)
export const createCategory = (...args) => adapter.createCategory(...args)
export const approveCategory = (...args) => adapter.approveCategory(...args)
export const createTask = (...args) => adapter.createTask(...args)
export const completeTask = (...args) => adapter.completeTask(...args)
export const dissolveSpace = (...args) => adapter.dissolveSpace(...args)
