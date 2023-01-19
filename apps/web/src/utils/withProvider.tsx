// TODO I don't know how to type this correctly
export const withProvider =
  // eslint-disable-next-line react/display-name
  (Provider: any) => (Component: any) => (props: any) =>
    (
      <Provider>
        <Component {...props} />
      </Provider>
    )
