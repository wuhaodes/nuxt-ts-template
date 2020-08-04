import { Context } from '@nuxt/types'
import uPassport from '~/app/@biz/uPassport'

export default async function (context: Context) {
  const { redirect, route, from } = context

  const passData = await uPassport.checkPassportData()
  const manager = passData.manager || {}

  if (!manager.managerId) {
    redirect('/auth/login')
  }

  const account = passData.account || {}
  const role = passData.role || 'none'
  if (!account.accountId || role === 'none') {
    redirect('/auth/login/select')
  }

  const path = route.path
  const type = account.type || ''

  // 如果是企业身份登陆
  if (type === 'company') {
    // 打开的不是企业页面或是空路由
    if (!path.startsWith('/cp') || path === '/') {
      redirect('/cp/home')
    }
  }

  // 如果是平台身份登陆，但是打开的不是平台页面
  if (type === 'platform' && !path.startsWith('/mp')) {
    redirect('/mp/home')
  }

  // 如果是企业身份登陆
  if (type === 'company') {

    // 打开的不是企业页面或是空路由
    if (!path.startsWith('/cp') || path === '/')
      redirect('/cp/home')
  }
}

