const qrs = [{
  x: 0.0001,
  y: 0.0001,
  w: 0.00001,
  color: '#000',
  logo: '',
  lw: 0.0001,
  disabled: false
}]

type TQRArr = typeof qrs

export const state = () => ({
  qrStack: [] as TQRArr[],
  qrStackIndicator: 0
})

export const mutations = {
  set_qrs (state: any, qrArr: TQRArr) {
    state.qrStack.push(qrArr)
    state.qrStackIndicator++
  },
  redo (state: any) {
    const qrStackLen = state.qrStack.length
    const indicator = state.qrStackIndicator + 1
    if (indicator > qrStackLen)
      return
    state.qrStackIndicator++
  },
  undo (state: any) {
    const indicator = state.qrStackIndicator - 1
    if (indicator < 0)
      return
    state.qrStackIndicator--
  },
}

export const getters = {}