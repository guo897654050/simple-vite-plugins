export default {
  name: 'I18n',
  // rollup钩子
  transform(code: string, id: string) {
    //id是import的路径
    if (!/vue&type=i18n/.test(id)) {
      return
    }
    return `export default Comp => {
      Comp.i18n = ${code}
    }`
  }
}