import { isLocalApiProvider, isWxCloudProvider } from '@/common/config/runtime'
import localApiAdapter from '@/common/services/adapters/localApiAdapter'
import mockAdapter from '@/common/services/adapters/mockAdapter'
import wxCloudAdapter from '@/common/services/adapters/wxCloudAdapter'

const adapter = isWxCloudProvider() ? wxCloudAdapter : isLocalApiProvider() ? localApiAdapter : mockAdapter

export const getState = (...args) => adapter.getState(...args)
export const getThemeByScore = (...args) => adapter.getThemeByScore(...args)
export const createSpace = (...args) => adapter.createSpace(...args)
export const acceptInvite = (...args) => adapter.acceptInvite(...args)
export const createCategory = (...args) => adapter.createCategory(...args)
export const approveCategory = (...args) => adapter.approveCategory(...args)
export const createTask = (...args) => adapter.createTask(...args)
export const completeTask = (...args) => adapter.completeTask(...args)
export const dissolveSpace = (...args) => adapter.dissolveSpace(...args)
