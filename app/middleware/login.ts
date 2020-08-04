import { Context } from '@nuxt/types'
import uPassport from '~/app/@biz/uPassport'

export default async function ({ redirect, route }: Context) {
   await uPassport.checkPassportInfo()
}
