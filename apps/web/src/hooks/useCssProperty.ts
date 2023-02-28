import useCSSCustomProperty from 'react-use-css-custom-property'

// TODO MSS Try to remove reliance to this
export const useCssProperty = (propertyName: string): string => {
  const [property] = useCSSCustomProperty(propertyName)
  return property.propertyValue
}

export const useCssProperties = (propertyNames: string[]): string[] => propertyNames.map(useCssProperty)
