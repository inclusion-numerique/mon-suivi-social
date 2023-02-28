export const asyncComponent = <P, C>(
  component: (properties: P) => Promise<C>,
): ((properties: P) => C) => component as (properties: P) => C
