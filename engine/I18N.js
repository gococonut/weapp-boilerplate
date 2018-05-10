export default class I18N {

  static locale = null
  static locales = {}

  static registerLocale = (locales) => {
    I18N.locales = locales
  }

  static setLocale = (lang) => {
    I18N.locale = lang
  }

  static i18n = (lines, ...args) => {
    const locale = I18N.locale
    const locales = I18N.locales

    const newLines = lines.split('.')
    let result = ''

    if (newLines.length > 0) {
      for (const line of newLines) {
        if (!result) {
          result = locales[locale][line]
          continue
        }

        result = result[line]
      }
    }

    return I18N._format(result, ...args)
  }

  static _format = (format, ...args) => {
    let result = (format || '').toString()
    for (let i = 0; i < args.length; i++) {
      const reg = new RegExp(`({)${i}(})`, 'g')
      result = result.replace(reg, args[i])
    }

    return result
  };
} 
