import { isLocalApiProvider, isWxCloudProvider } from '@/common/config/runtime'
import localApiAdapter from '@/common/services/adapters/localApiAdapter'
import mockAdapter from '@/common/services/adapters/mockAdapter'
import wxCloudAdapter from '@/common/services/adapters/wxCloudAdapter'

function getAdapter() {
  if (isWxCloudProvider()) return wxCloudAdapter
  if (isLocalApiProvider()) return localApiAdapter
  return mockAdapter
}

export const getState = (...args) => getAdapter().getState(...args)
export const createSpace = (...args) => getAdapter().createSpace(...args)
export const acceptInvite = (...args) => getAdapter().acceptInvite(...args)
export const createCategory = (...args) => getAdapter().createCategory(...args)
export const approveCategory = (...args) => getAdapter().approveCategory(...args)
export const createTask = (...args) => getAdapter().createTask(...args)
export const completeTask = (...args) => getAdapter().completeTask(...args)
export const dissolveSpace = (...args) => getAdapter().dissolveSpace(...args)
