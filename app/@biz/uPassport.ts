import { storage } from 'coa-nuxt'
import uCgi from '~/app/@biz/uCgi'

export default new class {

  // async checkPassportOption () {
  async checkPassportData () {
    let passportData = storage.session.get<Dic<any>>('passportData') || {}
    if (!passportData.option || !passportData.option.runEnv) {
      const { code } = await uCgi.AuthAccountData()
      if (code === 200) {
        passportData = storage.session.get<Dic<any>>('passportData') || {}
      } else {
        console.error('网络错误')
      }
    }
    return passportData
  }

  async checkPassportInfo () {
    let passportData = storage.session.get<Dic<any>>('passportData') || {}
    if (!passportData.account || !passportData.account.accountId) {
      const { code } = await uCgi.AuthAccountData()

      if (code === 200) {
        passportData = storage.session.get<Dic<any>>('passportData') || {}
      } else {
        console.error('网络错误')
      }
    }
    return passportData
  }

  getPassportInfo () {
    return storage.session.get<Dic<any>>('passportData') || {}
  }

  getPassport () {
    return storage.local.get<string>('passport') || ''
  }

  setPassport (passport: string) {
    return storage.local.set('passport', passport)
  }

  clearAllPassport () {
    storage.local.remove('passport')
    storage.session.remove('passportData')
  }

  removePassportInfo () {
    return storage.session.remove('passportData')
  }

  getRoleArray () {
    const passport = this.getPassportInfo()
    const myRole = (passport.role || 'none') as string
    return myRole.split(',')
  }

  checkRole (targetRole = 'none') {
    const roleArray = this.getRoleArray()
    for (const role of roleArray) {
      if (role === 'qa') return true
      const targetRoleArray = targetRole.split(',')
      for (const target of targetRoleArray) {
        if (target.trim().startsWith(role)) return true
      }
    }
    return false
  }
  // checkRole (targetRole = 'none') {
  //   const roleArray = this.getRoleArray()
  //   for (const role of roleArray) {
  //     if (role === 'qa') return true
  //     if (targetRole.startsWith(role)) return true
  //   }
  //   return false
  // }

  checkRoleIsMap () {
    const roleArray = this.getRoleArray()
    for (const role of roleArray) {
      if (role === 'qa') return true
      if (role.startsWith('map')) return true
    }
    return false
  }

  checkRoleIsQa () {
    const roleArray = this.getRoleArray()
    for (const role of roleArray) {
      if (role === 'qa') return true
    }
    return false
  }

}














