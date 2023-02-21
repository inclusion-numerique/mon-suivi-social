import {
  Component,
  ComponentProps,
  ElementType,
  PropsWithChildren,
} from 'react'

export function withProvider<
  Provider extends (props: PropsWithChildren) => JSX.Element,
  WrappedComponent extends ElementType,
>(provider: Provider) {
  return function (Component: WrappedComponent): WrappedComponent {
    // TODO I don't know how to type Provider correctly
    const Provider = provider as any

    return ((props: ComponentProps<WrappedComponent>) => (
      <Provider>
        <Component {...props} />
      </Provider>
    )) as WrappedComponent
  }
}
