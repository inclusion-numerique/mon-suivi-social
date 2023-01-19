export const sum = <K extends keyof T, T>(items: T[], key: K): number =>
  items.reduce((result, current) => {
    const value = current[key]
    if (typeof value !== 'number') {
      return result
    }
    return result + value
  }, 0)
