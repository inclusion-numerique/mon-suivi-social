export const asyncComponent = <P, C>(
  component: (props: P) => Promise<C>,
): ((props: P) => C) => component as (props: P) => C
